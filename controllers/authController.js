const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//POST /register:
const register = async (req, res, next) => {
  try {
    const users = req.app.locals.users;

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //Validate username, email, password
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    //username length validation
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        message: "Username must be between 3 and 20 characters",
      });
    }

    //password length validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    //Check email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter a valid email" });
    }

    //Check if email exists (400 if yes)
    const emailExists = users.some((user) => {
      return user.email.toLowerCase() === email.toLowerCase();
    });

    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create user object
    const user = {
      id: req.app.locals.getNextUserId(),
      username: username,
      email: email,
      hashedPassword: hashedPassword,
      role: "user",
    };
    //Add to users array
    users.push(user);

    //Generate JWT (7 day expiration)
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //Return { token, user }
    return res.status(201).json({
      message: "Registration successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    return next(error);
  }
};

//POST /login:
const login = async (req, res, next) => {
  try {
    const users = req.app.locals.users;

    const email = req.body.email;
    const password = req.body.password;

    //Validate email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }

    //Find user by email
    const user = users.find((user) => {
      return user.email.toLowerCase() === email.toLowerCase();
    });

    //Return 401 if not found
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    //Compare password with bcrypt.compare()
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    //Return 401 if wrong
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    //Generate JWT
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //Return { token, user }
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    return next(error);
  }
};

//GET /me (protected):
const me = (req, res, next) => {
  const users = req.app.locals.users;
  //Apply authenticateToken middleware
  // Find user by req.user.userId
  const user = users.find((user) => {
    return user.id === req.user.userId;
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Return user info
  return res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

//Test:

//Register new user
//Login
//GET /me with token
//GET /me without token - should fail

module.exports = {
  register,
  login,
  me,
};
