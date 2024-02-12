const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: 2,
      maxLength: 50,
      trim: true,
    },
    user_name: {
      type: String,
      required: [true, "user name is required"],
      minLength: 2,
      maxLength: 50,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required!"],
      minLength: 2,
      maxLength: 50,
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          return validator.isEmail(email);
        },
        message: "enter a valid email!",
      },
    },
    password: {
      type: String,
      required: [true, "password is required!"],
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    active: { type: Boolean, default: true },
    followers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
    following: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
    posts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
      default: [],
    },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = new mongoose.model("user", userSchema);
module.exports = User;
