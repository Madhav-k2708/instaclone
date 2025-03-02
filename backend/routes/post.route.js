import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
import {
  addComment,
  addNewPost,
  bookmarks,
  deletePost,
  disLikePost,
  getAllPost,
  getCommentsOfPost,
  getUserPost,
  likePost,
} from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.post("/addpost",isAuthenticated,upload.single("image"),addNewPost);
postRouter.get("/all", isAuthenticated, getAllPost);
postRouter.get("/userpost/all", isAuthenticated, getUserPost);
postRouter.get("/:id/like", isAuthenticated, likePost);
postRouter.get("/:id/dislike", isAuthenticated, disLikePost);
postRouter.post("/:id/comment", isAuthenticated, addComment);
postRouter.post("/:id/comment/all", isAuthenticated, getCommentsOfPost);
postRouter.delete("/delete/:id", isAuthenticated, deletePost);
postRouter.get("/:id/bookmark", isAuthenticated, bookmarks);

export default postRouter;
