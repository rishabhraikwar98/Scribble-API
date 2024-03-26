const Post = require("../model/postSchema");
const User = require("../model/userSchema");
const Comment = require("../model/commentSchema");
const Like = require("../model/likeSchema");
const createPost = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const { title, image } = req.body;
    const newPost = new Post({
      image,
      title,
      author: req.user._id,
    });
    await newPost.save();
    // adding new post to user
    await User.findByIdAndUpdate(req.user._id, {
      posts: [...currentUser.posts, newPost._id],
    });
    res.status(201).json({ status: "success", message: "New post created!" });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
const editPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;
    const { title,image } = req.body;
    const currentUser = await User.findById(userId);
    const currentPost = await Post.findById(postId);
    // Other user's post
    if (currentPost && !currentUser.posts.includes(postId)) {
      res.status(403).json({
        status: "fail",
        message: "Can not update other's post!",
      });
    }
    if (currentPost && currentUser.posts.includes(postId)) {
      await Post.findByIdAndUpdate(postId, { title: title,image:image });
      res.status(200).json({
        status: "success",
        message: "Post updated!",
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
const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;
    const currentUser = await User.findById(userId);
    const currentPost = await Post.findById(postId);
    // Other user's post
    if (currentPost && !currentUser.posts.includes(postId)) {
      res.status(403).json({
        status: "fail",
        message: "Can not delete other's post!",
      });
    }
    if (currentPost && currentUser.posts.includes(postId)) {
      await Post.findByIdAndDelete(postId);
      // deleting comments and likes related to post
      await Comment.deleteMany({ post: postId });
      await Like.deleteMany({ post: postId });
      await User.findByIdAndUpdate(userId, {
        posts: currentUser.posts.filter((id) => id.toString() !== postId.toString()),
      });
      res.status(204).json({
        status: "success",
        message: "Post deleted!",
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
      message: "Internal server error!",
    });
  }
};
const getAllPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    let allPosts = await Post.find({ author: userId })
      .select(["-__v"])
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: [
          "-__v",
          "-password",
          "-createdAt",
          "-updatedAt",
          "-active",
          "-posts",
          "-followers",
          "-following",
          "-bio",
          "-email",
        ],
      })
      .populate({
        path: "liked_by",
        select: ["-__v", "-post", "-createdAt", "-updatedAt","-_id"],
      })
      .lean();
    if (allPosts) {
      const response = allPosts.map((post) => {
        post.total_comments = post.comments.length;
        delete post.comments;
        return post;
      });
      res.status(200).json({
        status: "success",
        results: allPosts.length,
        posts: response,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Could not find posts!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
module.exports = {
  createPost,
  editPost,
  deletePost,
  getAllPosts,
};
