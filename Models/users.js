import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [7, "Name too Short"],
    maxLength: [50, "Name too Long"],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minLength: [7, "email too Short"],
    maxLength: [50, "email too Long"],
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
  },
  DOB: {
    type: Date,
  },
  joinedAt: {
    type: Date,
    default: new Date(),
  },
});

const user = mongoose.model("user", userSchema);
export default user;
