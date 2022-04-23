//required modules
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import createHttpError from "http-errors";
//routes
import postRoutes from "./Routes/posts.js";
import userRoutes from "./Routes/users.js";

//Configuration
dotenv.config();
const PORT = process.env.PORT || 8800;

// create app
const app = express();

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/posts/", postRoutes);
app.use("/api/users/", userRoutes);

//testing
app.get("/", (req, res) =>
  res.status(200).json({ message: "Everything Works Fine" })
);

// Database connection
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log("Server Running on Port: ", PORT));
  })
  .catch((error) => {
    console.log(error);
  });
