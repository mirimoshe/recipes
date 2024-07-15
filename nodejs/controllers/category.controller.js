import mongoose from "mongoose";
import Category from '../models/category.model.js'
import Recipe from "../models/recipe.model.js";



export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().select('-__v');
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        next(error);
        //res.status(500).json({ message: 'An error occurred while getting categories.' });
    }
};

export const getCategoryById = async (req, res, next) => {
    const categoryId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        next({ message: 'id is not valid' })
    }
    else {
        try {
            const category = await Category.findById(categoryId, { __v: false }).populate('recipesList');
            if (!category) {
                //return res.status(404).json({ message: 'Category not found' });
                next({ message: 'Category not found', status: 404 })
            }
            res.status(200).json(category);
        } catch (error) {
            console.error(error);
            //res.status(500).json({ message: 'An error occurred while getting the category.' });
            next(error);
        }
    }

};


export const getAllCategoriesWithRecipes = async (req, res, next) => {
    try {
        const categoriesWithRecipes = await Category.find({}).populate('recipesList').select('-__v');
        res.status(200).json(categoriesWithRecipes);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


/*export const addCategory = async (req, res, next) => {
    try {
      const { description } = req.body;//, numRecipes, recipesList
  
      // Create a new category using the Category model
      const newCategory = new Category({
        description: description,
        numRecipes: 1,
      });
      // Save the new category to the database
      await newCategory.save();
      // Fetch the added category with all its details
      const addedCategory = await Category.findById(newCategory._id);
      // Return the added category in the response
      return res.status(201).json(addedCategory);
    } catch (error) {
      next(error);
    }
};*/


export const addCategory = async (categoryDescription) => {
    try {
        let category;
        // Check if the category already exists
        if (typeof categoryDescription === 'string') {
            category = await Category.findOne({ description: categoryDescription });
            console.log("there is a category");
        }
        if (!category) {
            // If the category doesn't exist or categoryDescription is not a string, create a new category
            const newCategory = new Category({
                description: categoryDescription,
                numRecipes: 1 // Assuming initial number of recipes for a new category is 1
            });
            category = await newCategory.save();

        }

        return category;
    } catch (error) {
        throw error;
    }
};



export const deleteCategory = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        try {
            if (!(await Category.findById(id)))
                return next({ message: 'category not found!!!', status: 404 })

            await Category.findByIdAndDelete(id)
            return res.status(204).send();
        } catch (error) {
            return next(error)
        }
    }
};


export const getRecipesByCategoryDescription = async (req, res) => {
    //const { description } = req.query;
    const description=req.params.description
    console.log(description,"here");
    if (!description) {
        return res.status(400).send('Category description is required');
    }
    
    try {
        // Find the category by description
        const category = await Category.findOne({ description });
        if (!category) {
            return res.status(404).send('Category not found');
        }

        // Find all recipes with the matching category name
        const recipes = await Recipe.find({ categoryName: category.description });
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes by category description:', error);
        res.status(500).send(error.message);
    }
};
