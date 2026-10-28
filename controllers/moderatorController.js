//PUT /recipes/:id/feature:

//Apply authenticateToken AND requireModerator
//Find recipe by ID
//Set isFeatured = true
//Return updated recipe

//PUT /recipes/:id/hide:

//Apply both middlewares
//Find recipe
//Set isHidden = true
//Return updated recipe

//Test:

//Login as moderator
//Feature a recipe - should work
//Hide a recipe - should work
//Login as regular user
//Try to feature recipe - should return 403
//Verify hidden recipes don't show in public GET /recipes
