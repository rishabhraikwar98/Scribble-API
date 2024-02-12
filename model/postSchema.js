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
      ref: "user",
    },
    comments: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    }

  },
  { timestamps: true }
);
const Post = new mongoose.model("post", postSchema);
module.exports = Post;
