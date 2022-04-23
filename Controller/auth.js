import User from "../Models/users.js";
import { validateEmail } from "../Validators/users.js";
import mongoose from "mongoose";
import bycrpt from "bcryptjs";

// authentication user
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const existingUser = await User.findOne({ email });

    //user doesn't exist
    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    //check credentials
    const passwordCorrect = await bycrpt.compare(
      password,
      existingUser.password
    );

    //password doesnt match
    if (!passwordCorrect) {
      return res.status(404).json({ message: "Password InCorrect" });
    }

    //return user
    res.status(200).json(existingUser);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// register user
export const signUp = async (req, res) => {
  const { email, password, firstName, lastName, DOB } = req.body;

  // hash password
  let hashedPassword = await bycrpt.hash(password, 12);

  //create a new user object
  const newUser = new User({
    name: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    DOB: new Date(DOB),
  });

  // store user in database
  try {
    let result = await newUser.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// //delete a user account
// export const deleteUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     //check if id exists
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(404).json({ message: "Object Not Found" });
//     }

//     //delete user
//     await User.findByIdAndRemove(id);

//     res.status(200).json({ message: "User Deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// };
// //update user info
// export const updateUser = async (req, res) => {};
