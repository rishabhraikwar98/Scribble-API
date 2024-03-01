const Post = require("../model/postSchema");
const User = require("../model/userSchema");
const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query; // Defaults: page 1, limit 10
    const currentUser = await User.findById(userId);
    const followingPosts = await Post.find({
      author: { $in: currentUser.following },
    })
      .skip((page - 1) * limit) // Skip based on page and limit
      .limit(limit)
      .select(["-__v"])
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
      }).populate({
        path: "liked_by",
        select: ["-__v", "-post", "-createdAt", "-updatedAt","-_id"],
      })
      .lean();

    const ownPosts = await Post.find({ author: userId })
      .skip((page - 1) * limit) // Skip based on page and limit
      .limit(limit)
      .select(["-__v"])
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
      }).populate({
        path: "liked_by",
        select: ["-__v", "-post", "-createdAt", "-updatedAt","-_id"],
      })
      .lean();

    let feed = followingPosts
      .concat(ownPosts)
      .sort((a, b) => b.createdAt - a.createdAt);

    feed = feed.map((post) => {
      post.total_comments = post.comments.length;
      delete post.comments;
      return post;
    });
    // Calculate total number of posts (optional)
    const totalPostsCount = await Post.countDocuments({
      author: { $in: currentUser.following.concat(userId) },
    });

    const totalPages = Math.ceil(totalPostsCount / limit); // Calculate total pages

    res.json({
      feed,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
module.exports = { getFeed };
