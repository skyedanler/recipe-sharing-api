const express = require("express");
const router = express.Router();
const moderatorController = require("../controllers/moderatorController");
const { authenticateToken } = require("../middleware/auth");

//PUT /recipes/:id/feature:
//PUT /recipes/:id/hide:
router.put("/recipes/:id/feature", moderatorController.feature);
router.put("/recipes/:id/hide", moderatorController.hide);

module.exports = router;
