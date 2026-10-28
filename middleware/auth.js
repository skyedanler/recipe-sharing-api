const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
//authenticateToken function:
const authenticateToken = (req, res, next) => {
  //Check Authorization header
  const authHeader = req.headers.authorization;

  //Extract token from "Bearer TOKEN"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token required",
    });
  }

  try {
    //Verify with jwt.verify()
    const decoded = jwt.verify(token, JWT_SECRET);

    //Attach user to req.user
    req.user = decoded;
    //Call next()
    next();
  } catch (error) {
    //return 401 if invalid
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  }
};

//requireModerator function:
const requireModerator = (req, res, next) => {
  //Check if req.user.role === "moderator"
  if (req.user.role !== "moderator") {
    //Return 403 if not moderator
    return res.status(403).json({
      message: "Moderator access required",
    });
  }

  //Call next() if moderator
  next();
};

module.exports = {
  authenticateToken,
  requireModerator,
};
