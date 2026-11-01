const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { authenticateToken } = require("../middleware/auth");

//GET / (public recipes):
//GET /:id (single recipe):
//POST / (create):
//GET /my-recipes (user's own):
//PUT /:id (update):
//DELETE /:id (delete):
router.get("/", recipeController.getRecipes);
router.get("/my-recipes", authenticateToken, recipeController.getOwnRecipes);
router.get("/:id", recipeController.getRecipeById);
router.post("/", authenticateToken, recipeController.createRecipe);
router.put("/:id/", authenticateToken, recipeController.updateRecipe);
router.delete("/:id/", authenticateToken, recipeController.deleteRecipe);

module.exports = router;
