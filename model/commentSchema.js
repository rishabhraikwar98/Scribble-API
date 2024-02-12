const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: [true, "comment is required!"],
      min: 2,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const Comment = new mongoose.model("comment", postSchema);
module.exports = Comment;
