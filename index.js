import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"; //is imported to load environment variables from a .env file.
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"; //middlewares to handle a request in that path
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/post.js";
import { users, posts } from "./data/index.js";

/*configurations*/
//the middleware stuff (something that runs in between each requests)

const __filename = fileURLToPath(import.meta.url); // to grab the file url
const __dirname = path.dirname(__filename); // to grab the directory name
dotenv.config();
const app = express(); // creates an instance of the Express application.
app.use(express.json()); //
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // to prevent CORS errors
app.use(morgan("common")); // to log the requests using the "common" format.
app.use(bodyParser.json({ limit: "30mb", extended: true })); // limit the size of the request body
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); // to prevent CORS errors
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // set the directory for where we keep the assets

/*FILE STORAGE*/
// uploaded images will be stored into "public/assets" with its original name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }); // use this variable everytime we want to upload a file

/*ROUTES WITH FILES*/
// made these here instead of in the routes folder files because we need the upload variable
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/*ROUTES*/
app.use("/auth", authRoutes); //help set up routes and adds a prefix to all the routes(ex: line 6 in auth.js)
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/*MONGOOSE SET UP*/
// connect to the database
const PORT = process.env.PORT || 6001; // if the port is not available, use 6001
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

    //manually inject the dummy data: MUST DO ONLY ONE TIME
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
