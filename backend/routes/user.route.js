import { Router } from "express";
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/:id/profile", isAuthenticated, getProfile);
userRouter.post(
  "/profile/edit",
  isAuthenticated,
  upload.single("profilePicture"),
  editProfile
);
userRouter.get("/suggested-users", isAuthenticated, getSuggestedUsers);
userRouter.put("/followorunfollow/:id", isAuthenticated, followOrUnfollow);

export default userRouter;
