const User = require("../model/userSchema")
const Post = require("../model/postSchema")
const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query; // Defaults: page 1, limit 10
    const currentUser = await User.findById(userId);
    
    // Get the list of followed users and include the current user's id
    const followedUsers = [userId, ...currentUser.following];
    
    // Find total number of posts from followed users
    const totalPosts = await Post.countDocuments({
      author: { $in: followedUsers },
    });
    
    // Calculate total pages based on the total number of posts and the specified limit
    const totalPages = Math.max(Math.ceil(totalPosts / limit), 1); // Ensure totalPages is at least 1
    
    // Ensure currentPage does not exceed totalPages
    const currentPage = Math.min(Math.max(page, 1), totalPages); // Ensure currentPage is between 1 and totalPages
    
    // Fetch posts from followed users, sorted by latest to oldest
    const posts = await Post.find({ author: { $in: followedUsers } })
      .select(["-__v"]).populate({
        path: "liked_by",
        select: ["-__v", "-post", "-createdAt", "-updatedAt","-_id"],
      })
      .sort({ createdAt: -1 }) // Sort by latest to oldest
      // .skip((currentPage - 1) * limit) // Pagination: Skip records
      // .limit(limit) // Pagination: Limit records per page
      .populate("author", ["name", "avatar", "user_name"])
      .lean(); // Populate user field with name and avatar

    // Map posts to add a field for total comments and remove the comments array
    const feed = posts.map((p) => {
      p.total_comments = p.comments.length;
      delete p.comments;
      return p;
    });

    // Send response with feed data, total pages, and current page
    res.status(200).json({ status: "success", feed, totalPages, currentPage });
  } catch (error) {
    // Handle server error
    console.error(error);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};

module.exports = { getFeed };
