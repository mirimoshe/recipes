import express from 'express';
import {auth} from '../middlewares/auth.js';
import {getAllRecipes,getRecipeById,getRecipesByUser,getRecipesByprepTime,addRecipe,updateRecipe,deleteRecipe} from '../controllers/recipe.controller.js'
import authenticateToken from '../middlewares/authenticateToken.js';

export const recipeRouter = express.Router();

recipeRouter.get('/',getAllRecipes);
recipeRouter.get('/:id',getRecipeById);
recipeRouter.get('/by-user/:id',getRecipesByUser);
recipeRouter.get('/by-prepTime/:preptime',getRecipesByprepTime);
recipeRouter.post('/',auth,authenticateToken,addRecipe);
recipeRouter.put('/:id',updateRecipe);
recipeRouter.delete('/:id',deleteRecipe);
