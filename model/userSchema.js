const mongoose = require("mongoose");
const validator = require("validator")
const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    require: [true, "user name is required"],
    min: 2,
    max: 50,
    trim: true,
  },
  email: {
    type: String,
    require: [true, "email is required!"],
    min: 2,
    max: 50,
    trim: true,
    unique: true,
    validate:{
      validator: function(email){
        return validator.isEmail(email)
      },
      message:"enter a valid email!"
    }
  },
  password: {
    type: String,
    require: [true, "password is required!"],
    min: 6,
    max: 50,
    trim: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  active: { type: Boolean, default: true },
  followers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    default: [],
  },
  posts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
    default: [],
  },
  bio: { type: String, default: "" },
},{timestamps:true});
const User = new mongoose.model("scribbleUser", userSchema);
module.exports = User;
