const jwt = require("jsonwebtoken");

//GET / (public recipes):
const getRecipes = (req, res, next) => {
  try {
    const recipes = req.app.locals.recipes;

    //Filter recipes where isPublic === true AND isHidden === false
    const publicRecipes = recipes.filter((recipe) => {
      return recipe.isPublic === true && recipe.isHidden === false;
    });

    //Return public, non-hidden recipes only
    return res.status(200).json(publicRecipes);
  } catch (error) {
    return next(error);
  }
};

//GET /:id (single recipe):
const getRecipeById = (req, res, next) => {
  try {
    const recipes = req.app.locals.recipes;

    //Find recipe by ID
    const recipeId = Number(req.params.id);

    const recipe = recipes.find((recipe) => {
      return recipe.id === recipeId;
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    //Check for a valid token if one was provided
    let user = null;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      try {
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
    }

    //If recipe.isPublic === false, check if requester is owner
    if (!recipe.isPublic) {
      if (recipe.createdBy !== user?.userId) {
        return res.status(403).json({
          message: "You are not authorized to view this recipe",
        });
      }
    }

    //If recipe.isHidden === true, only owner or moderator can view
    //Return 403 if not authorized to view
    if (recipe.isHidden) {
      if (recipe.createdBy !== user?.userId && user?.role !== "moderator") {
        return res.status(403).json({
          message: "You are not authorized to view this recipe",
        });
      }
    }

    //Return recipe
    return res.status(200).json(recipe);
  } catch (error) {
    return next(error);
  }
};

//POST / (create):
const createRecipe = (req, res, next) => {
  try {
    const recipes = req.app.locals.recipes;

    const title = req.body.title;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    const cookTime = req.body.cookTime;

    //Validate title, ingredients, instructions, cookTime
    if (!title || !ingredients || !instructions || cookTime === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (
      typeof title !== "string" ||
      title.trim().length < 3 ||
      title.trim().length > 100
    ) {
      return res.status(400).json({
        message: "Title must be between 3 and 100 characters",
      });
    }

    //Validate ingredients is non-empty array
    if (
      !Array.isArray(ingredients) ||
      ingredients.length === 0 ||
      !ingredients.every(
        (ingredient) =>
          typeof ingredient === "string" && ingredient.trim().length > 0,
      )
    ) {
      return res.status(400).json({
        message: "Ingredients must be a non-empty array of strings",
      });
    }

    //Validate instructions is non-empty array
    if (
      !Array.isArray(instructions) ||
      instructions.length === 0 ||
      !instructions.every(
        (instruction) =>
          typeof instruction === "string" && instruction.trim().length > 0,
      )
    ) {
      return res.status(400).json({
        message: "Instructions must be a non-empty array of strings",
      });
    }

    if (
      typeof cookTime !== "number" ||
      !Number.isFinite(cookTime) ||
      cookTime <= 0
    ) {
      return res.status(400).json({
        message: "Cook time must be a positive number",
      });
    }

    if (
      req.body.isPublic !== undefined &&
      typeof req.body.isPublic !== "boolean"
    ) {
      return res.status(400).json({
        message: "isPublic must be true or false",
      });
    }

    //Create recipe with unique ID
    //Set createdBy = req.user.userId
    //Set isPublic = true (default)
    const newRecipe = {
      id: req.app.locals.getNextRecipeId(),
      createdBy: req.user.userId,
      isPublic: req.body.isPublic === undefined ? true : req.body.isPublic,
      isFeatured: false,
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      cookTime: cookTime,
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    //Add to recipes array
    recipes.push(newRecipe);

    //Return created recipe
    return res.status(201).json(newRecipe);
  } catch (error) {
    return next(error);
  }
};

//GET /my-recipes (user's own):
const getOwnRecipes = (req, res, next) => {
  try {
    const recipes = req.app.locals.recipes;

    //Filter recipes where createdBy === req.user.userId
    const ownRecipes = recipes.filter((recipe) => {
      return recipe.createdBy === req.user.userId;
    });

    //Return ALL user's recipes (including private)
    return res.status(200).json(ownRecipes);
  } catch (error) {
    return next(error);
  }
};

//PUT /:id (update):
const updateRecipe = (req, res, next) => {
  try {
    const recipes = req.app.locals.recipes;

    //Find recipe by ID
    const recipeId = Number(req.params.id);

    const recipe = recipes.find((recipe) => {
      return recipe.id === recipeId;
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    //Verify createdBy === req.user.userId (403 if not owner)
    if (recipe.createdBy !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to update this recipe",
      });
    }

    //Validate any fields being updated
    const { title, ingredients, instructions, cookTime, isPublic } = req.body;

    if (
      title !== undefined &&
      (typeof title !== "string" ||
        title.trim().length < 3 ||
        title.trim().length > 100)
    ) {
      return res.status(400).json({
        message: "Title must be between 3 and 100 characters",
      });
    }

    if (
      ingredients !== undefined &&
      (!Array.isArray(ingredients) ||
        ingredients.length === 0 ||
        !ingredients.every(
          (ingredient) =>
            typeof ingredient === "string" && ingredient.trim().length > 0,
        ))
    ) {
      return res.status(400).json({
        message: "Ingredients must be a non-empty array of strings",
      });
    }

    if (
      instructions !== undefined &&
      (!Array.isArray(instructions) ||
        instructions.length === 0 ||
        !instructions.every(
          (instruction) =>
            typeof instruction === "string" && instruction.trim().length > 0,
        ))
    ) {
      return res.status(400).json({
        message: "Instructions must be a non-empty array of strings",
      });
    }

    if (
      cookTime !== undefined &&
      (typeof cookTime !== "number" ||
        !Number.isFinite(cookTime) ||
        cookTime <= 0)
    ) {
      return res.status(400).json({
        message: "Cook time must be a positive number",
      });
    }

    if (isPublic !== undefined && typeof isPublic !== "boolean") {
      return res.status(400).json({
        message: "isPublic must be true or false",
      });
    }

    //Update allowed fields
    const allowedFields = [
      "title",
      "ingredients",
      "instructions",
      "cookTime",
      "isPublic",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        recipe[field] = req.body[field];
      }
    });

    recipe.updatedAt = new Date();

    //Return updated recipe
    return res.status(200).json(recipe);
  } catch (error) {
    return next(error);
  }
};

//DELETE /:id (delete):
const deleteRecipe = (req, res, next) => {
  try {
    const recipes = req.app.locals.recipes;

    //Find recipe
    const recipeId = Number(req.params.id);

    const recipe = recipes.find((recipe) => {
      return recipe.id === recipeId;
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    //Verify ownership
    if (recipe.createdBy !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this recipe",
      });
    }

    //Remove from array
    const recipeIndex = recipes.findIndex((recipe) => {
      return recipe.id === recipeId;
    });

    recipes.splice(recipeIndex, 1);

    //Return success
    return res.status(200).json({
      message: "Recipe has been deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

//Test:

//Create recipe as user A
//GET public recipes - should see it
//Update own recipe - should work
//Try to update another user's recipe - should fail
//Set recipe to private (isPublic: false)
//GET public recipes - should NOT see private recipe
//GET my-recipes - should see private recipe

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  getOwnRecipes,
  updateRecipe,
  deleteRecipe,
};
