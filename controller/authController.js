const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSignup = async (req, res) => {
  const { name, user_name, email, password } = req.body;
  try {
    let newUser = new User({
      name,
      user_name,
      email,
      password,
    });
    if (password.trim().length >= 8) {
      const hashPassword = await bcrypt.hash(password, 12);
      newUser.password = hashPassword;
    } else {
      return res.status(400).json({
        status: "fail",
        message: "password must be minimum 8 character long!",
      });
    }
    await newUser.save();
    let token = jwt.sign(
      {
        data: newUser._id,
      },
      process.env.jwt_secret,
      { expiresIn: "90d" }
    );
    res
      .cookie("access_token", token, { secure: true, httpOnly: false })
      .status(201)
      .json({
        status: "success",
        message: "Signup successfull!",
        access_token: token,
      });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.email == 1) {
        return res.status(400).json({
          status: "fail",
          message: `Email: ${error.keyValue.email} is already in use!`,
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: `User Name: ${error.keyValue.user_name} is already in use!`,
        });
      }
    } else {
      res.status(500).json({
        status: "fail",
        message: "Internal Server error!",
      });
    }
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "Could not find user!" });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (ismatch) {
      let token = jwt.sign(
        {
          data: user._id,
        },
        process.env.jwt_secret,
        { expiresIn: "90d" }
      );
      //res.cookie("jwt", token, { secure: true, httpOnly: false });
      res
        .cookie("access_token", token, { secure: true, httpOnly: false })
        .status(200)
        .json({
          status: "success",
          access_token: token,
        });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Incorrect password!",
      });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal server error!" });
  }
};
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;
  try {
    const currentUser = await User.findById(userId);
    if (!(await bcrypt.compare(currentPassword, currentUser.password))) {
      return res
        .status(400)
        .json({ status: "fail", message: "Current password is incorrect." });
    }
    if (newPassword.trim().length >= 8) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await User.findByIdAndUpdate(userId, { password: hashedNewPassword });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "New password must be minimum 8 character long!",
      });
    }

    res
      .status(200)
      .json({ status: "success", message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
module.exports = { userSignup, userLogin, changePassword };
