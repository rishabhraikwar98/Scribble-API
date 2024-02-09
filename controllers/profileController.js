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
    const myProfile = await User.findOne({ _id: id }).select([
      "-__v",
      "-password",
      "-createdAt",
      "-updatedAt",
      "-active",
    ]);
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
    const { user_name, avatar, bio } = req.body;
    const result = await User.findOneAndUpdate(
      { _id: id },
      {
        user_name,
        bio,
        avatar,
      }
    );
    if (result) {
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
    res.status(400).json({
      status: "fail",
      message: "error.message",
    });
  }
};
const deactivateMyProfile = async (req, res) => {
  try {
    const id = idFromToken(req);
    const result = await User.findOneAndUpdate({ _id: id }, { active: false });
    if (result) {
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

module.exports = { getMyProfile, updateMyProfile, deactivateMyProfile };
