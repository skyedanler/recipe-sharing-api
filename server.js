//Load dotenv
require("dotenv").config();

//Import express, cors, helmet, express-rate-limit
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const expressRateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");

//routes
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const moderatorRoutes = require("./routes/moderatorRoutes");

//Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

//Apply middleware: helmet(), cors(), express.json()
app.use(helmet());
app.use(cors());
app.use(express.json());

//Set up rate limiting for auth
const authLimiter = expressRateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: "Too many attempts. Please try again later." },
});

//Add root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Recipe API is running" });
});

//users array (add one moderator user with pre-hashed password)
const users = [];
//recipes array (start empty)
const recipes = [];
//ID counter variables
let nextUserId = 1;
let nextRecipeId = 1;

//need a way to access arrays and counters across files
app.locals.users = users;
app.locals.recipes = recipes;

app.locals.getNextUserId = () => nextUserId++;
app.locals.getNextRecipeId = () => nextRecipeId++;

//Create moderator user
const hashedPassword = bcrypt.hashSync(process.env.MODERATOR_PASSWORD, 10);

const moderator = {
  id: nextUserId++,
  username: "moderator",
  email: "moderator@example.com",
  hashedPassword: hashedPassword,
  role: "moderator",
  createdAt: new Date(),
};

users.push(moderator);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/moderator", moderatorRoutes);

//Add error handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? "Internal server error" : err.message,
  });
});

//Listen on PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
