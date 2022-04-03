import User from "../Models/users.js";
import { validateEmail } from "../Validators/validation.js";
import mongoose from "mongoose";
import bycrpt from "bcryptjs";
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    console.log(existingUser);
    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const passwordCorrect = await bycrpt.compare(
      password,
      existingUser.password
    );
    if (!passwordCorrect) {
      return res.status(404).json({ message: "Password InCorrect" });
    }

    res.status(200).json(existingUser);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const signUp = async (req, res) => {
  const { email, password, firstName, lastName, DOB } = req.body;
  if (!validateEmail(email)) {
    return res.status(409).json({ message: "Invalid Email" });
  }
  let hashedPassword = await bycrpt.hash(password, 12);
  const newUser = new User({
    name: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    DOB: new Date(DOB),
  });
  try {
    let result = await newUser.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Object Not Found" });
    }

    await User.findByIdAndRemove(id);

    res.status(200).json({
      message: "User Deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
export const updateUser = async (req, res) => {};
