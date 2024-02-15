const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: [true, "comment is required!"],
      minLength: 2,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    post:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"post"
    }
  },
  { timestamps: true }
);

const Comment = new mongoose.model("comment", commentSchema);
module.exports = Comment;
