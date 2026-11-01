# Recipe Sharing API

A RESTful API built with Node.js and Express that allows users to register, log in, and share recipes. Users can create, view, update, and delete their own recipes, while moderators can feature or hide recipes.

This project was created as part of the Codecademy Full-Stack Engineering Bootcamp.

## Technologies Used

- Node.js
- Express.js
- JavaScript
- bcryptjs
- JSON Web Tokens
- dotenv
- Helmet
- CORS
- express-rate-limit
- Postman

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication for protected routes
- Recipe creation, retrieval, updating, and deletion
- Public and private recipes
- Recipe ownership verification
- Moderator-only routes for featuring and hiding recipes
- Input validation and error handling
- Rate limiting for authentication routes

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate into the project folder and install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory using `.env.example` as a reference:

   ```env
   PORT=3001
   JWT_SECRET=your_secret_key
   MODERATOR_PASSWORD=your_moderator_password
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001` when using the example port.

## API Endpoints

### authController

POST - `/api/auth/register` (Register a new user)
POST - `/api/auth/login` (Log in)
GET - `/api/auth/me` (Retrieve user information)

### moderatorController

PUT -  `/api/moderator/recipes/:id/feature` (Feature a recipe)
PUT - `/api/moderator/recipes/:id/hide` (Hide a recipe)

### recipeController

GET - `/api/recipes` (Retrieve public recipes)
GET - `/api/recipes/:id` (Retrieve a recipe by ID if authorized)
GET - `/api/recipes/my-recipes` (Retrieve the current user's recipes by JWT)
POST - `/api/recipes` (Create a recipe)
PUT - `/api/recipes/:id` (Update a recipe if you have the JWT)
DELETE -  `/api/recipes/:id` (Delete a recipe if you have the JWT)

## Authentication

Protected endpoints require a JWT provided in the request's Authorization header:

Enter user token into Bearer Token Authorization


## Testing

The API was tested using Postman.

Testing included:

- Successful registration and login
- Duplicate email and incorrect password errors
- Accessing protected endpoints with and without JWTs
- Creating, retrieving, updating, and deleting recipes
- Public and private recipe visibility
- Preventing users from modifying recipes they do not own
- Moderator permissions for featuring and hiding recipes
- Excluding hidden recipes from public listings

## Security

- Passwords are hashed using bcrypt.
- Protected routes use JWT authentication.
- Moderator endpoints require role-based authorization.
- Authentication routes use rate limiting.
- Helmet and CORS middleware are enabled.
- Environment variables are used for sensitive configuration.

## Future Improvements

- Add persistent database storage
- Add recipe search and filtering
- Add recipe categories
- Create a frontend interface

