//GET / (public recipes):
const getRecipes = (req, res, next) => {
  try {
    //Filter recipes where isPublic === true AND isHidden === false
    const publicRecipes = recipes.filter(recipe => {
      return recipe.isPublic === true && recipe.isHidden === false;
    });
  
    //Return public, non-hidden recipes only
    return res.status(200).json(publicRecipes);
  } catch (error) {
    return next(error);
  }
}


//GET /:id (single recipe):
const getRecipeById = (req, res, next) => {
  try {
    //Find recipe by ID
    const recipeId = Number(req.params.id);

    const recipe = recipes.find(recipe => {
      return recipe.id === recipeId;
    })

    //If recipe.isPublic === false, check if requester is owner
    //if (!recipe.isPublic) {
    //  if (user.role)
    //}
    //If recipe.isHidden === true, only owner or moderator can view
    //Return 403 if not authorized to view
    //Return recipe
  } catch (error) {
    return next(error);
  }
}


//POST / (create):
const createRecipe = (req, res, next) => {
  try {
    const title = req.body.title;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;
    const cookTime = req.body.cookTime;
    
    //Validate title, ingredients, instructions, cookTime
    if (!title || !ingredients || !instructions || !cookTime) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    //Validate ingredients is non-empty array
    if (ingredients.length > 0) {
      return res.status(400).json({ message: "Please enter ingredients" });
    } 
    
    //Validate instructions is non-empty array
    if (instructions.length > 0) {
      return res.status(400).json({ message: "Please enter instructions" });
    }
    
    //Create recipe with unique ID
    //Set createdBy = req.user.userId
    //Set isPublic = true (default)
    const newRecipe = {
      id: nextRecipeId,
      createdBy: req.user.userId,
      isPublic: true,
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      cookTime: cookTime,
      isHidden: false,
    }
    //Add to recipes array
    recipes.push(newRecipe);
    //Return created recipe
    return res.status(200).json(newRecipe);
  } catch (error) {
    return next(error);
  }
}

//GET /my-recipes (user's own):
const getOwnRecipes = (req, res, next) => {
  try {
    //Filter recipes where createdBy === req.user.userId
    //Return ALL user's recipes (including private)
  } catch (error) {
    return next(error);
  }
}


//PUT /:id (update):
const updateRecipe = (req, res, next) => {
  try {
    //Find recipe by ID
    //Verify createdBy === req.user.userId (403 if not owner)
    //Update allowed fields
    //Return updated recipe
  } catch (error) {
    return next(error);
  }
}


//DELETE /:id (delete):
const deleteRecipe = (req, res, next) => {
  try {
    //Find recipe
    //Verify ownership
    //Remove from array
    //Return success
  } catch (error) {
    return next(error);
  }
}

//Test:

//Create recipe as user A
//GET public recipes - should see it
//Update own recipe - should work
//Try to update another user's recipe - should fail
//Set recipe to private (isPublic: false)
//GET public recipes - should NOT see private recipe
//GET my-recipes - should see private recipe