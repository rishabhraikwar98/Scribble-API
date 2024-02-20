const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "post is required!"],
      minLength: 2,
      trim: true,
    },
    image:{
      type: String,
      minLength: 2,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
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
  {
    toObject:{virtuals:true}
  },
  { timestamps: true }
);
const Post = new mongoose.model("post", postSchema);
module.exports = Post;
