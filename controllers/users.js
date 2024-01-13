import User from "../models/User.js";

//read:

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    //user.friends is an array of the user's friends' IDs
    //we use the map function to get the friend's information and store it as an array of objects
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    //format the friends array to only include the information we want to send to the frontend
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      })
    );
    res.status(200).json(formattedFriends); //send this formatted friends to the frontend
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**UPDATE */

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      //If user remove being freinds with another user, then we remove them being friends with eachother in both arrays
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    //Wait to save these to the DB before moving on
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    //format the friends array to only include the information we want to send to the frontend
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      })
    );
    res.status(200).json(formattedFriends); //send this formatted friends to the frontend
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
