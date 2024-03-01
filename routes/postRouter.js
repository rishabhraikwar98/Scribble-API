const express = require("express");
const {
  createPost,
  editPost,
  deletePost,
  getAllPosts,
} = require("../controller/postController");
const {
  createNewComment,
  viewAllComments,
  deleteComment,
} = require("../controller/commentController");
const {likePost,unlikePost} = require("../controller/likeController")
const router = express.Router();
router.route("/").post(createPost);
router.route("/:userId/all").get(getAllPosts);
router.route("/:postId").patch(editPost).delete(deletePost);
router
  .route("/:postId/comment")
  .post(createNewComment)
  .get(viewAllComments)
router.route("/:postId/comment/:commentId").delete(deleteComment)
router.route("/:postId/like").post(likePost).delete(unlikePost)


module.exports = router;
