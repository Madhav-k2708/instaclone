import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, requried: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", requried: true },
});

export const Comment = mongoose.model("Comment", commentSchema);
