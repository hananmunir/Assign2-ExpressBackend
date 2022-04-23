//Required Modules
import mongoose from "mongoose";
import postDescription from "../Models/postDescription.js";
import fs from "fs";
import util from "util";
import { uploadFile, getFileStream, deleteFile } from "../Services/s3.js";

const unlinkFile = util.promisify(fs.unlink);

//Uses ID to download images from s3 bucket
export const getImage = async (req, res) => {
  const key = req.params.id;

  //if key no provided
  if (key == "undefined") {
    return res.status(404).json({ Message: "Object Not Found" });
  }

  //download image and render it
  try {
    const readStream = getFileStream(key);
    readStream.pipe(res);
  } catch (error) {
    res.status(404).json({ Message: "Something went wrong" });
  }
};

//get a single post
export const getPost = async (req, res) => {
  //destructure id from paramaters
  const { id } = req.params;
  try {
    //check if post exists
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("Object not found");

    //get post using the id
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

    res.status(200).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// create a new post
export const createPost = async (req, res) => {
  //get required fields from body
  const { title, desc, cost, date, duration, destination } = req.body;

  try {
    //upload image to s3
    let result = await uploadFile(req.file).then((result) => result);

    //deletes the file from local storage
    await unlinkFile(req.file.path);

    //create new post object
    const newPost = new postDescription({
      title,
      destination,
      cost,
      image: result.Key,
      description: desc,
      departureDate: date,
      duration,
    });

    //save object in database
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

//update an existing post
export const updatePost = async (req, res) => {
  //get id from parametes and post data from body

  const { id } = req.params;
  const post = req.body;
  const file = req.file;

  try {
    const olderPost = await postDescription.findById(id);
    //check if post exist
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("Object not found");
    }

    //upload file and add attribute if file exists
    file
      ? await uploadFile(file).then((result) => (post.image = result.Key))
      : null;

    //update the post
    const updatedPost = await postDescription.findByIdAndUpdate(
      id,
      { id, ...post },
      { new: true }
    );

    if (file) {
      //deletes the file from local storage
      await unlinkFile(req.file.path);
      //deletes the file from s3
      deleteFile(olderPost.image);
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete a post using id
export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    //check if post exists
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("Object not found");

    //to delete image from S3 bucket
    const post = await postDescription.findById(id);
   // deleteFile(post.image);

    //delete post
    //await postDescription.findByIdAndRemove(id);

    res.status(200).json({ message: "Post Removed" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
