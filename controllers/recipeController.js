//GET / (public recipes):

//Filter recipes where isPublic === true AND isHidden === false
//Return public, non-hidden recipes only

//GET /:id (single recipe):

//Find recipe by ID
//If recipe.isPublic === false, check if requester is owner
//If recipe.isHidden === true, only owner or moderator can view
//Return 403 if not authorized to view
//Return recipe

//POST / (create):

//Apply authenticateToken middleware
//Validate title, ingredients, instructions, cookTime
//Validate ingredients is non-empty array
//Validate instructions is non-empty array
//Create recipe with unique ID
//Set createdBy = req.user.userId
//Set isPublic = true (default)
//Add to recipes array
//Return created recipe

//GET /my-recipes (user's own):

//Apply authenticateToken middleware
//Filter recipes where createdBy === req.user.userId
//Return ALL user's recipes (including private)

//PUT /:id (update):

//Apply authenticateToken middleware
//Find recipe by ID
//Verify createdBy === req.user.userId (403 if not owner)
//Update allowed fields
//Return updated recipe

//DELETE /:id (delete):

//Apply authenticateToken middleware
//Find recipe
//Verify ownership
//Remove from array
//Return success
//Test:

//Create recipe as user A
//GET public recipes - should see it
//Update own recipe - should work
//Try to update another user's recipe - should fail
//Set recipe to private (isPublic: false)
//GET public recipes - should NOT see private recipe
//GET my-recipes - should see private recipe
