import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private categoryURL = `${environment.apiURL}/category`;
  constructor() { }

  getAll() {
    return this.http.get(this.categoryURL);
  }

  getRecipesbyCategory(category:string) {
    return this.http.get(`${this.categoryURL}/recipesbycategory/${category}`);
  }
}
