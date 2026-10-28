//Load dotenv
require("dotenv").config();

//Import express, cors, helmet, express-rate-limit
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const expressRateLimit = require("express-rate-limit");

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
//recipes array (start empty)
//ID counter variables

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
