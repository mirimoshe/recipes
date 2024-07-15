import mongoose from 'mongoose'
import Joi from 'joi'

//import { type } from 'os'


export const categoriesSchema = new mongoose.Schema({
  description:{type:String,require:true},
  numRecipes:{type:Number},
  //recipesList:[{ type: mongoose.Types.ObjectId, ref: 'Recipe' }],
})

export const categoriesValidator = {
    description: Joi.string().required(),
    numRecipes:Joi.number(),
};

const Category = mongoose.model('Category', categoriesSchema);
export default Category;
