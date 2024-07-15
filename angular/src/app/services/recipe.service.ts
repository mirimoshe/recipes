import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Recipes } from '../models/recipes';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private http = inject(HttpClient);
  private recipeURL = `${environment.apiURL}/recipe`;

  // private token =localStorage.getItem('mytoken');
  
  // addRecipe(addRecipe: Recipes) {
  //   return this.http.post<{ recipe: Recipes; token: string }>(
  //     `${this.userURL}/`,
  //     addRecipe
  //   );
  // }

  // constructor() { }

  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('mytoken');
    }
    return null;
  }

  getAll() {
    return this.http.get(this.recipeURL);
  }

  getById(id:number) {
    return this.http.get(`${this.recipeURL}/${id}`);
  }


  private token = this.getToken();

  addRecipe(addRecipe: Recipes) {
    console.log(addRecipe,'token:',this.getToken);
    return this.http.post<{ recipe: Recipes; token: string }>(
      `${this.recipeURL}/`,
      addRecipe,
      {
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {}
      }
    );
  }



  constructor() { }
}
