const express = require("express");
const router = express.Router();
const moderatorController = require("../controllers/moderatorController");
const { authenticateToken, requireModerator } = require("../middleware/auth");

//PUT /recipes/:id/feature:
//PUT /recipes/:id/hide:

router.put(
  "/recipes/:id/feature",
  authenticateToken,
  requireModerator,
  moderatorController.feature,
);

router.put(
  "/recipes/:id/hide",
  authenticateToken,
  requireModerator,
  moderatorController.hide,
);

module.exports = router;
