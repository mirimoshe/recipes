import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AddResipeComponent } from './components/add-resipe/add-resipe.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { RecipeCardComponent } from './components/recipe-card/recipe-card.component';
import { RecipeCardsComponent } from './components/recipe-cards/recipe-cards.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AboutpageComponent } from './components/aboutpage/aboutpage.component';
import { RecipePageComponent } from './components/recipe-page/recipe-page.component';
import { MyRecipesComponent } from './components/my-recipes/my-recipes.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'category', component: CategoriesComponent },
    { path: 'recipes', component: RecipeCardsComponent },
    { path: 'about', component: AboutpageComponent },
    { path: 'newrecipe', component: AddResipeComponent },
    { path: 'recipepage/:id', component: RecipePageComponent },
    { path: 'myrecipes', component: MyRecipesComponent }
    
];
// { path: '', component: AddResipeComponent },
