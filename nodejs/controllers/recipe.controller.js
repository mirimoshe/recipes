import mongoose from "mongoose";
import Recipe from '../models/recipe.model.js';
import Category from "../models/category.model.js";
import { addCategory } from "./category.controller.js";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { log } from "console";

export const getAllRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find().select('-__v');
        res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        next(error);
        //res.status(500).json({ message: 'An error occurred while getting categories.' });
    }
};

export const getRecipeById = async (req, res, next) => {
    const recipeId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        next({ message: 'id is not valid' })
    }
    else {
        try {
            const recipe = await Recipe.findById(recipeId, { __v: false });
            if (!recipe) {
                //return res.status(404).json({ message: 'Category not found' });
                next({ message: 'Recipe not found', status: 404 })
            }
            res.status(200).json(recipe);
        } catch (error) {
            console.error(error);
            //res.status(500).json({ message: 'An error occurred while getting the category.' });
            next(error);
        }
    }

};

export const getRecipesByUser = async (req, res, next) => {
    const addedByUser = req.params.user;
    try {
        const recipes = await Recipe.find({ addedByUser: addedByUser }, { __v: false });
        if (!recipes || recipes.length === 0) {
            //return res.status(404).json({ message: 'No recipes found for the specified user' });
            return next({ message: 'No recipes found for the specified user', status: 404 })
        }
        res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const getRecipesByprepTime = async (req, res, next) => {
    const prepTime = req.params.user;
    try {
        const recipes = await Recipe.find({ prepTime: prepTime }, { __v: false });
        if (!recipes || recipes.length === 0) {
            //return res.status(404).json({ message: 'No recipes found for the specified user' });
            return next({ message: 'No recipes found for the specified preparation Time', status: 404 })
        }
        res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

/*export const addRecipe = async (req, res, next) => {
    console.log(req.user.role,"role");
    try {
        if (req.user.role === "admin" || req.user.role === "user") {
            const recipe = new Recipe(req.body);
            await recipe.save(); 
            return res.status(201).json(recipe); 
        }
        else {
            next({ message: 'only registered can add recipe', status: 403 })
        }
    } catch (error) {
        next(error);
    }
};*/

export const updateRecipe = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    try {
        const recipe = await Recipe.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )
        return res.json(recipe);
    } catch (error) {
        next(error)
    }
};

export const deleteRecipe = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        try {
            if (!(await Recipe.findById(id)))
                return next({ message: 'recipe not found!!!', status: 404 })

            await Recipe.findByIdAndDelete(id)
            return res.status(204).send();
        } catch (error) {
            return next(error)
        }
    }
};


/*export const addRecipe = async (req, res, next) => {
    try {
        if (req.user.role === "admin" || req.user.role === "user") {
            const recipeData = req.body;
            const categoryDescription = recipeData.categoryName; // Assuming categoryName is the category description provided
            // Check if the category exists in the Category table
            const category = await Category.findOne({ description: categoryDescription });
            const newCategory = addCategory(category);
            if (newCategory) {
                const recipe = new Recipe({...recipeData,kodCategory:newCategory._id});
                    // Add other fields as needed
                console.log("new recipe",recipe);
                await recipe.save();
                return res.status(201).json(recipe);
            } else {
                next({ message: 'Category does not exist in the system', status: 400 });
            }
        } else {
            next({ message: 'Only registered users can add recipes', status: 403 });
        }
    } catch (error) {
        next(error);
    }
};*/

// export const addRecipe = async (req, res, next) => {
//     try {
//         if (req.user.role === "admin" || req.user.role === "user") {
//             const recipeData = req.body;
//             const categoryDescription = recipeData.categoryName[0].categoryType;
//             const category = await addCategory(categoryDescription);
//             const recipe = new Recipe({
//                 /*kodCategory: category._id,
//                 addedByuser: req.user._id,*/
//                 ...recipeData
//                 // Add other fields as needed
//             });
//             const updatecategory = await Category.findOneAndUpdate(
//                 { _id: category._id },
//                 //{ $set: { 'recipesList': category._id } },
//                 { $push: { recipesList: recipe._id } },
//                 { new: true }
//             );
//             await recipe.save();
//             return res.status(201).json(recipe);
//         } else {
//             next({ message: 'Only registered users can add recipes', status: 403 });
//         }
//     } catch (error) {
//         next(error);
//     }
// };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const saveImage = (base64Image, index) => {
    const matches = base64Image.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return null;
    }

    const fileExtension = matches[1];
    const base64Data = matches[2];

    const imagePath = path.join(uploadDir, `image${Date.now()}_${index}.${fileExtension}`);

    // Save the image to the file system
    fs.writeFileSync(imagePath, base64Data, 'base64');
    return imagePath;
};

export const addRecipe = async (req, res, next) => {
console.log(req.body);
    try {
        // req.user contains the payload of the decoded token
        if (req.user.role === 'admin' || req.user.role === 'user') {
            const recipeData = req.body;
            //const categoryDescription = recipeData.categoryName[0].categoryType;
            // console.log(recipeData);
            let categoryDescription = recipeData.categoryName;
            console.log("here", recipeData.categoryName, typeof (categoryDescription));
            let category = await Category.findOne({ description: categoryDescription });

            if (!category) {
                // If the category doesn't exist, create a new one
                category = new Category({
                    description: categoryDescription,
                    numRecipes: 1,
                    //recipesList: []
                });
                await category.save();
            } else {
                //If the category exists, increment the numRecipes
                const categoryUpdate = await Category.findByIdAndUpdate(
                    category.id,
                    { $inc: { numRecipes: 1 } },
                    { new: true }
                );
                //category.numRecipes += 1;
                //await category.save();
            }
            const savedImages = (recipeData.recipeImages || []).map((image, index) => saveImage(image, index)).filter(Boolean);
            recipeData.recipeImages = savedImages;

            const recipe = new Recipe({
                ...recipeData,
                categoryName: categoryDescription, // Set the category name
                //addedByuser: req.user._id // Use user ID from the token
            });
            console.log("recipe", recipe);
            //category.recipesList.push(recipe._id);
            await category.save();
            await recipe.save();

            return res.status(201).json(recipe);
        } else {
            next({ message: 'Only registered users can add recipes', status: 403 });
        }
    } catch (error) {
        next(error);
    }
};
