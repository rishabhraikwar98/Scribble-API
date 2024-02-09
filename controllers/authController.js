const bcrypt = require("bcrypt");
const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");

const userSignup = async (req, res) => {
  const { user_name, email, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ user_name, email, password: hashPassword });
    await newUser.save();
    let token = jwt.sign(
      {
        data: newUser._id,
      },
      process.env.jwt_secret,
      { expiresIn: "90d" }
    );
    res.cookie("jwt",token,{secure:true,httpOnly:false})
    res.status(201).json({
      status: "success",
      message:"signup successfull!",
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ status: "fail", message: "Email already in use!" });
    } else {
      res.status(400).json({ status: "fail", message:error.message });
    }
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ status: "fail", message: "could not find user!" });
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
      res.cookie("jwt",token,{secure:true,httpOnly:false})
      res.status(200).json({
        status: "success",
        token,
      });
    } else {
      res.status(200).json({
        status: "fail",
        message: "password did not match!",
      });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
module.exports = { userSignup, userLogin };
