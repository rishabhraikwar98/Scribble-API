const Post = require("../model/postSchema");
const Like = require("../model/likeSchema");
const likePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;
    const currentPost = await Post.findById(postId);
    if (currentPost) {
      const newLike = new Like({
        user: userId,
        post: postId,
      });
      await newLike.save();
      await Post.findByIdAndUpdate(postId, {
        liked_by: [...currentPost.liked_by, newLike._id],
      });
      res.status(201).json({
        status: "success",
        message: "Added Like!",
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Could not find post!",
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        status: "fail",
        message: "Already liked this post!",
      });
    } else {
      res.status(500).json({
        status: "fail",
        message: "Internal server error!",
      });
    }
  }
};
const unlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;
    const currentPost = await Post.findById(postId);
    if (currentPost) {
      const result = await Like.findOne({ user: userId, post: postId });
      if (result) {
        await Like.findOneAndDelete({ user: userId, post: postId });
        await Post.findByIdAndUpdate(postId, {
          liked_by: currentPost.liked_by.filter(
            (id) => id.toString() !== result._id
          ),
        });
        res.status(204).json({
          status: "success",
          message: "Removed Like!",
        });
      }
    } else {
      res.status(404).json({
        status: "fail",
        message: "Could not find post!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error!",
    });
  }
};

module.exports = { likePost, unlikePost };
