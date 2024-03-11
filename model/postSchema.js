const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    image:{
      default:"",
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required:[true,"Author is required!"]
    },
    comments: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
      default: [],
    },
    liked_by: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "like" }],
      default: [],
    },
  },
  { timestamps: true }
  );
const Post = new mongoose.model("post", postSchema);
module.exports = Post;
