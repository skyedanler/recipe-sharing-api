const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { authenticateToken } = require("../middleware/auth");

//PUT /:id (update):
//DELETE /:id (delete):
router.put("/:id/", recipeController.update);
router.delete("/:id/", recipeController.delete);

module.exports = router;
