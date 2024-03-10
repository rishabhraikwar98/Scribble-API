const Post = require("../model/postSchema");
const Comment = require("../model/commentSchema");

const createNewComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { comment } = req.body;
    const { postId } = req.params;
    const currentPost = await Post.findById(postId);
    if (currentPost) {
      const newComment = new Comment({
        comment,
        user: userId,
        post: postId,
      });
      await newComment.save();
      await Post.findByIdAndUpdate(postId, {
        comments: [...currentPost.comments, newComment._id],
      });
      res.status(201).json({
        status: "success",
        message: "Added new comment!",
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Could not find post!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
const viewAllComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const allComments = await Comment.find({ post: postId }).sort({ createdAt: -1 })
      .select(["-__v", "-updatedAt"])
      .populate({
        path: "user",
        select: [
          "-__v",
          "-password",
          "-createdAt",
          "-updatedAt",
          "-active",
          "-posts",
          "-followers",
          "-following",
          "-email",
          "-bio",
        ],
      });
    if (allComments) {
      res.status(200).json({
        status: "success",
        results: allComments.length,
        comments: allComments,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Could not find comments!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error!",
    });
  }
};
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;
    const currentPost = await Post.findById(postId);
    const currentComment = await Comment.findById(commentId);
    if (!currentPost) {
      res.status(404).json({
        status: "fail",
        message: "Could not find post!",
      });
    }
    if (!currentComment) {
      res.status(404).json({
        status: "fail",
        message: "Could not find comment!",
      });
    }
    if (
      currentPost.author._id.toString() === userId.toString() ||
      currentComment.user._id.toString() === userId.toString()
    ) {
      await Comment.findByIdAndDelete(commentId);
      await Post.findByIdAndUpdate(postId, {
        comments: currentPost.comments.filter((id) => {
          return id.toString() !== commentId.toString();
        }),
      });
      res.status(204).json({
        status: "success",
        message: "Comment deleted!",
      });
    } else {
      res.status(403).json({
        status: "fail",
        message: "Can not delete other's comment from others's post!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error!",
    });
  }
};

module.exports = { createNewComment, viewAllComments, deleteComment };
