import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: "Image required",
      });
    }

    // image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      success: true,
      message: "New post",
      post,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const likedUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //Like logic started
    await post.updateOne({ $addToSet: { likes: likedUserId } });

    await post.save();

    // Implement socket io for real time notification
    const user = await User.findById(likedUserId).select('username profilePicture')
    const postOwnerId = post.author.toString()
    if (postOwnerId !== likedUserId) {
      // emit a notification event
      const notification = {
        type:'like',
        userId:likedUserId,
        userDetails:user,
        postId,
        message:'Your post was liked'
      } 
      const postOwnerSocketId = getReceiverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit('notification', notification);
    }

    return res.status(200).json({
      success: true,
      message: "Post liked",
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const disLikePost = async (req, res) => {
  try {
    const likedUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //Like logic started
    await post.updateOne({ $pull: { likes: likedUserId } });
    await post.save();

    // Implement socket io for real time notification
    const user = await User.findById(likedUserId).select('username profilePicture')
    const postOwnerId = post.author.toString()
    if (postOwnerId !== likedUserId) {
      // emit a notification event
      const notification = {
        type:'dislike',
        userId:likedUserId,
        userDetails:user,
        postId,
        message:'Your post was disliked'
      } 
      const postOwnerSocketId = getReceiverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit('notification', notification);
    }

    return res.status(200).json({
      success: true,
      message: "Post disliked",
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commenteduserId = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }
    const comment = await Comment.create({
      text,
      author: commenteduserId,
      post: postId,
    });
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      success: true,
      comment,
      message:"Comment posted"
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username, profilePicture"
    );
    if (!comments) {
      return res.status(404).json({
        success: false,
        message: "No comments found for this post",
      });
    }

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // delete post
    await Post.findByIdAndDelete(postId);

    // remove the post id from the user's post
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);

    await user.save();

    // delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarks = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // already bookmarked -> remove from the bookmark
      await User.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        success: true,
        message: "Post removed from the bookmark",
      });
    } else {
      // add to bookmark
      await User.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        success: true,
        message: "Post added to bookmark",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
