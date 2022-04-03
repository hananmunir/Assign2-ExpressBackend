import mongoose from "mongoose";
import postDescription from "../Models/postDescription.js";
import { validateDate } from "../Validators/validation.js";
export const getPost = async (req, res) => {
  //you can use query to, by using req.query

  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("Object not found");

    const post = await postDescription.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// get all posts
export const getPosts = async (req, res) => {
  try {
    const post = await postDescription.find();

    if (post.length == 0) {
      return res.status(404).send("Object not found");
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { title, desc, cost, images, departureDate, duration, destination } =
    req.body;

  let date = new Date(departureDate);
  if (!validateDate(date)) {
    return res.status(409).json({ message: "Invalid Date" });
  }
  const newPost = new postDescription({
    title: title,
    destination,
    cost,
    selectedImages: images,
    description: desc,
    departureDate: date,
    duration: duration,
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("Object not found");

    const updatedPost = await postDescription.findByIdAndUpdate(
      id,
      { id, ...post },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("Object not found");

    await postDescription.findByIdAndRemove(id);

    res.status(200).json({ message: "Post Removed" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
