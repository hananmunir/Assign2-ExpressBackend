import express from "express";
import { signIn, signUp } from "../Controller/auth.js";
import { validateUser } from "../Middleware/auth.js";
//router
const router = express.Router();

//routes
router.get("/", signIn);
router.post("/", validateUser, signUp);
// router.patch("/:id", updateUser);
// router.delete("/:id", deleteUser);

export default router;
