import bcrypt from "bcrypt"; // will encrypt passwords to be saved in db
import jwt from "jsonwebtoken"; // send user a webtoken for autherization
import User from "../models/User.js";

/*REGISTER USER*/
//IDEA:the passoword is encrypted, save it. then when user logs in, hash the password and compare it with the encrypted one in the DB. then Given a JSON webtoken

//calling mongo DB, like an API call, so it needs to be async
// req = request body from front end, res = response sending back to front end
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile,
      impressions,
    } = req.body; // destructure the request body

    const salt = await bcrypt.genSalt(); // encrypting the password
    const passwordHash = await bcrypt.hash(password, salt); // hashing the password
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 100000), // dummy value
      impressions: Math.floor(Math.random() * 100000),
    });
    const savedUser = await newUser.save(); // save the user to the database
    res.status(201).json(savedUser); // send the user back a statuse code of 201 and the saved user
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

/*LOGIN USER*/

/*
NOTE: 
JWT: A digital ID card that contains user details and can be shown to prove who you are without revealing sensitive information like your 
password. This ID card (JWT) helps verify your identity without needing to log in again and again when visiting different parts of the website

*/

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // find the user by email in the DB using Mongoose
    //If the user does not exist:
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password); // compare the password entered with the password in the DB
    //If the password is incorrect:
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // create a token for the user
    delete user.password;
    res.status(200).json({ token, user }); // send the user back a statuse code of 200 and the token
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};
