import User from "../models/User.js";
import Post from "../models/post.js";

//Create:
//IMAGE BEING PASSED THROUGH TO THE MIDDLEWARE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();
    const post = await Post.find(); //grabs all the posts including the updated posts from when we saved it
    res.status(201); //201 repressents we created something
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//read:

export const getFeedPosts = async (req, res) => {
  try {
    //here I get all the posts and return it
    const post = await Post.find();
    res.status(200).json(post); //200 represents successful
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }); //finds all the posts that's associated with the user's id
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//update:

export const likePosts = async (req, res) => {
  try {
    const { id } = req.params; //gets it from the URL
    const { userId } = req.body; //gets it from the body
    const post = await Post.findById(id); //gets the postId
    const isLiked = await post.likes.get(userId);
    //if user has already liked the post then isLiked = True, so we delete

    if (isLiked) {
      post.likes.delete(userID);
    } else {
      post.likes.set(userId, true);
    }

    //do this to update and show it in the frontend once the user clicks the like button
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
