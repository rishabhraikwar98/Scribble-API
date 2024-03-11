const Post = require("../model/postSchema");
const User = require("../model/userSchema");
const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query; // Defaults: page 1, limit 10
    const currentUser = await User.findById(userId);
    const followedUsers = currentUser.following;
    followedUsers.push(userId); // Include user's own posts
    const totalPosts = await Post.countDocuments({
      author: { $in: followedUsers },
    });
    const totalPages = Math.ceil(totalPosts / limit);
    const currentPage = Math.min(page, totalPages);
    const posts = await Post.find({ author: { $in: followedUsers } })
      .select(["-__v"])
      .sort({ createdAt: -1 }) // Sort by latest to oldest
      .skip((currentPage - 1) * limit) // Pagination: Skip records
      .limit(limit) // Pagination: Limit records per page
      .populate("author", ["name", "avatar", "user_name"])
      .lean(); // Populate user field with name and avatar

    const response = posts.map((p) => {
      p.total_comments = p.comments.length;
      delete p.comments;
      return p;
    });
    res
      .status(200)
      .json({ status: "success", feed: response, totalPages, currentPage });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
module.exports = { getFeed };
