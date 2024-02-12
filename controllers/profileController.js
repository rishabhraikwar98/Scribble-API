const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");

const idFromToken = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const id = jwt.verify(token, process.env.jwt_secret).data;
  return id;
};
const getMyProfile = async (req, res) => {
  try {
    const id = idFromToken(req);
    const myProfile = await User.findOne({ _id: id })
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
        ],
      });
    if (myProfile) {
      res.status(200).json({
        status: "success",
        data: myProfile,
      });
    } else {
      res.status(404).json({
        status: "success",
        message: "could not find profile!",
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
    const id = idFromToken(req);
    const { name, user_name, avatar, bio } = req.body;
    const myProfileResult = await User.findOneAndUpdate(
      { _id: id },
      {
        name,
        user_name,
        bio,
        avatar,
      }
    );
    if (myProfileResult) {
      res.status(200).json({
        status: "success",
        message: "profile updated!",
      });
    } else {
      res.status(404).json({
        status: "success",
        message: "could not find profile!",
      });
    }
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
    const id = idFromToken(req);
    const myProfileResult = await User.findOneAndUpdate(
      { _id: id },
      { active: false }
    );
    if (myProfileResult) {
      res.status(200).json({
        status: "success",
        message: "profile deactivated!",
      });
    } else {
      res.status(404).json({
        status: "success",
        message: "could not find profile!",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "error.message",
    });
  }
};

const searchProfiles = async (req, res) => {
  const { query } = req.query;
  try {
    if (query) {
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
      ]);
      if (users) {
        res.status(200).json({
          status: "success",
          results: users.length,
          data: users,
        });
      } else {
        res.status(404).json({
          status: "success",
          message: "no profile found!",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
const viewProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await User.findOne({ _id: id })
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
        ],
      });
    if (profile) {
      res.status(200).json({
        status: "success",
        data: profile,
      });
    } else {
      res.status(404).json({
        status: "success",
        message: "could not found profile!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
const followAccount = async (req, res) => {
  const userToFollowId = req.params.id;
  const userId = idFromToken(req);
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find the user to follow
    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    // Check if the current user is already following the user
    if (currentUser.following.includes(userToFollowId)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    // Add the user to follow to the current user's following list
    currentUser.following.push(userToFollowId);
    userToFollow.followers.push(currentUser);
    await currentUser.save();
    await userToFollow.save();

    return res
      .status(200)
      .json({ status: "success", message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error!",
    });
  }
};
const unfollowAccount = async (req, res) => {
  const userToUnfollowId = req.params.id;
  const userId = idFromToken(req);
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user to unfollow
    const userToUnfollow = await User.findById(userToUnfollowId);
    if (!userToUnfollow) {
      return res.status(404).json({ message: "User to unfollow not found" });
    }

    // Check if the current user is already not following the user
    if (!currentUser.following.includes(userToUnfollowId)) {
      return res
        .status(400)
        .json({ message: "You are not following this user" }); //;
    }
    // Remove the user to unfollow from the current user's following list
    currentUser.following = currentUser.following.filter((id) => {
      return id.toString() !== userToUnfollowId;
    });
    await currentUser.save();
    // Remove the unfollowing user's ID from the list of followers of the user being unfollowed
    userToUnfollow.followers = userToUnfollow.followers.filter((id) => {
      return id.toString() !== userId;
    });
    await userToUnfollow.save();
    return res.status(200).json({ message: "User unfollowed successfully" });
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
  followAccount,
  unfollowAccount,
};
