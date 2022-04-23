import express from "express";
import {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getImage,
} from "../Controller/posts.js";
import { removeUndefined, upload, validatePost } from "../Middleware/posts.js";

//router
const router = express.Router();

// app routes
router.get("/:id", getPost);
router.get("/", getPosts);
router.post("/", upload.single("image"), validatePost, createPost);
router.patch("/:id", upload.single("image"), removeUndefined, updatePost);
router.delete("/:id", deletePost);
router.get("/images/:id", getImage);

export default router;
