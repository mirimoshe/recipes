import { getAllCategories, getCategoryById, getAllCategoriesWithRecipes,deleteCategory, getRecipesByCategoryDescription } from '../controllers/category.controller.js'
import express from 'express';

export const categoryRouter = express.Router();

categoryRouter.get('/recipesbycategory/:description', getRecipesByCategoryDescription);
categoryRouter.get('/with-recipes',getAllCategoriesWithRecipes);
categoryRouter.get('/',getAllCategories);
categoryRouter.get('/:id',getCategoryById);
categoryRouter.delete('/:id',deleteCategory);

