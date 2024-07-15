import mongoose from 'mongoose'
import Joi from 'joi'
import { type } from 'os'
//import { type } from 'os'


// export const recipeCategorySchema = new mongoose.Schema({
//     kodCategory: [{ type: mongoose.Types.ObjectId, ref: 'Category', required: false }],
//     categoryType: { type: String },
// })

export const IngredientsSchema = new mongoose.Schema({
    amount:{type:Number},
    ingredient:{type:String}
})

export const layersRecipeSchema = new mongoose.Schema({
    layerDescription: { type: String },
    //Ingredients: { type: [String] }
    ingredients:[IngredientsSchema]
})

export const recipeSchema = new mongoose.Schema({
    recipeName: { type: String, require: true },
    description: { type: String, require: true, minlength: [10, 'description length < 10'] },
    categoryName: {type:String},//[recipeCategorySchema],//
    preparationTime: { type: Number },
    difficultyLevel: { type: Number },
    additionDate: { type: Date, default: Date.now },
    preparationSteps: [{ type: String }],
    recipeImages: { type: [String], default: [] },
    isPrivate: { type: Boolean, require: true },
    //addedByuser: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    addedByuser: { type: mongoose.Types.ObjectId, ref: 'User' },
    dishesAmount: { type: Number },
    layers: [layersRecipeSchema],
})


export const recipeValidator = {
    recipeName: Joi.string().required().max(20),
    description: Joi.string().required().max(25).pattern(/^[a-zA-Zא-ת]+$/),
    preparationTime: Joi.number(),
    difficultyLevel: Joi.number().integer().min(1).max(5),
    additionDate: Joi.date(),
    isPrivate: Joi.bool().required(),
    dishesAmount: Joi.number(),
}

export const recipeCategoryValidator = Joi.object({
    //kodCategory: Joi.number(),
    categoryType: Joi.string().required()
});

export const layersRecipeValidator = Joi.object({
    layerDescription: Joi.string(),
    Ingredients: Joi.array().items(Joi.string())
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;