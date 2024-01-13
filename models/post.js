import mongoose from "mongoose";

const postScheme = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
//use a map for the likes because searchtime for the user within a map is O(1) instead of an array which is O(n)

const Post = mongoose.model("Post", postScheme);
export default Post;
