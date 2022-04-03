import express from "express";
import { signIn, signUp, updateUser, deleteUser } from "../Controller/users.js";

const router = express.Router();

router.get("/", signIn);
router.post("/", signUp);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router