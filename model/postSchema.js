const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    post: {
      type: String,
      require: [true, "post is required!"],
      min: 2,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "scribbleUsers",
    },
    comments: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "scribbleComments" }],
    },
  },
  { timestamps: true }
);
const Post = new mongoose.model("scribblePost", postSchema);
module.exports = Post;
