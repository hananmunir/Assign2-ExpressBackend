import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: [3, "Title too Short"],
    maxLength: [100, "Title too long"],
  },
  cost: {
    type: Number,
    required: true,
    min: 0,
  },
  destination: {
    type: String,
    required: true,
  },
  selectedImages: {
    type: [String],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: [10, "Description too Short"],
  },
  departureDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  seatsAvailble: {
    type: Boolean,
    default: true,
  },
});

const postDescription = mongoose.model("postDescription", postSchema);

export default postDescription;
