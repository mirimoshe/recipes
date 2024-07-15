export interface Ingredient {
    amount: number;
    ingredient: string;
}

export interface Layer {
    layerDescription: string;
    ingredients: Ingredient[];
}

export interface Recipes {
    recipeName: string;
    categoryName: string;
    description: string;
    preparationTime: number; // assuming this is the total time in minutes
    difficultyLevel: string;
    dishesAmount: number;
    isPrivate: boolean;
    recipeImages: string[];
    layers: Layer[];
    preparationSteps: string[];
}
