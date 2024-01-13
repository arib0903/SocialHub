import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization"); // from the front end, grabbing the Authorization header

    if (!token) {
      return res.status(403).send("Access denied"); // if there is no token, send a status code of 403
    }

    // grabbing the actual token that comes afteer "bearer "
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // to move on to the next middleware
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
