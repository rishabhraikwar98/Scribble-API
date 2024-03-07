const User = require("../model/userSchema");

const getMyProfile = async (req, res) => {
  try {
    const myProfile = await User.findById(req.user._id)
      .select(["-__v", "-password", "-createdAt", "-updatedAt", "-active"])
      .populate({
        path: "followers",
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
        ],
      })
      .populate({
        path: "following",
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
        ],
      })
      .lean();
    if (myProfile) {
      myProfile.total_posts = myProfile.posts.length;
      delete myProfile.posts;
      res.status(200).json({
        status: "success",
        myProfile,
      });
    } else {
      res.status(404).json({
        status: "success",
        message: "could not find user!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
const updateMyProfile = async (req, res) => {
  try {
    const { name, user_name, avatar, bio } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      name,
      user_name,
      bio,
      avatar,
    });

    res.status(200).json({
      status: "success",
      message: "Profile updated!",
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.user_name == 1) {
      res.status(400).json({
        status: "fail",
        message: `User Name: ${error.keyValue.user_name} is already in use!`,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  }
};
const deactivateMyProfile = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      active: false,
    });
    res.status(200).json({
      status: "success",
      message: "profile deactivated!",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const searchProfiles = async (req, res) => {
  try {
    const { query } = req.query;
    const searchCriteria = {
      $or: [
        { user_name: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    };
    // Search users based on criteria
    const users = await User.find(searchCriteria).select([
      "-password",
      "-__v",
      "-createdAt",
      "-updatedAt",
      "-active",
      "-followers",
      "-following",
      "-posts",
      "-email",
    ]);
    res.status(200).json({
      status: "success",
      results: users.length,
      profiles: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error!",
    });
  }
};
const viewProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await User.findById(id)
      .select(["-password", "-__v", "-createdAt", "-updatedAt", "-active"])
      .populate({
        path: "followers",
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
        ],
      })
      .populate({
        path: "following",
        select: [
          "-__v",
          "-password",
          "-createdAt",
          "-updatedAt",
          "-active",
          "-followers",
          "-following",
          "-posts",
          "-email",
        ],
      })
      .lean();
    if (profile) {
      profile.total_posts = profile.posts.length;
      delete profile.posts;
      res.status(200).json({
        status: "success",
        profile,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Could not find user!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error!",
    });
  }
};
const followProfile = async (req, res) => {
  try {
    const userToFollowId = req.params.id;
    const userId = req.user._id;
    const currentUser = await User.findById(userId);
    // Find the user to follow
    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found!" });
    }
    // Check if the current user is already following the user
    if (currentUser.following.includes(userToFollowId.toString())) {
      return res
        .status(400)
        .json({ message: "You are already following this user!" });
    }
    currentUser.following.push(userToFollowId);
    userToFollow.followers.push(userId);
    await currentUser.save();
    await userToFollow.save();
    return res
      .status(200)
      .json({ status: "success", message: "User followed successfully!" });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error!",
    });
  }
};
const unfollowProfile = async (req, res) => {
  try {
    const userToUnfollowId = req.params.id;
    const userId = req.user._id;
    const currentUser = await User.findById(userId);

    // Find the user to unfollow
    const userToUnfollow = await User.findById(userToUnfollowId);
    if (!userToUnfollow) {
      return res.status(404).json({ message: "User to unfollow not found!" });
    }
    if (!currentUser.following.includes(userToUnfollowId)) {
      return res
        .status(400)
        .json({ message: "You are not following this user!" }); //;
    }
    currentUser.following.pull(userToUnfollowId);
    userToUnfollow.followers.pull(userId);
    await currentUser.save();
    await userToUnfollow.save();
    return res.status(200).json({ message: "User unfollowed successfully!" });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error!",
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  deactivateMyProfile,
  searchProfiles,
  viewProfile,
  followProfile,
  unfollowProfile,
};
