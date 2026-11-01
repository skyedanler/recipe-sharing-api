const feature = async (req, res, next) => {
  try {
    const recipes = req.app.locals.recipes;

    // Find recipe by ID
    const recipeId = Number(req.params.id);

    const recipe = recipes.find((recipe) => {
      return recipe.id === recipeId;
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Set isFeatured = true
    recipe.isFeatured = true;
    // Return updated recipe
    return res.status(200).json(recipe);
  } catch (error) {
    return next(error);
  }
};

const hide = async (req, res, next) => {
  try {
    const recipes = req.app.locals.recipes;
    
    // Find recipe by ID
    const recipeId = Number(req.params.id);

    const recipe = recipes.find((recipe) => {
      return recipe.id === recipeId;
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Set isHidden = true
    recipe.isHidden = true;
    // Return updated recipe
    return res.status(200).json(recipe);
  } catch (error) {
    return next(error);
  }
};

module.exports = { feature, hide };
