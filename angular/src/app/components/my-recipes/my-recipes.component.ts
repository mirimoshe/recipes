import { Component, inject } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [RecipeCardComponent,CommonModule],
  templateUrl: './my-recipes.component.html',
  styleUrl: './my-recipes.component.scss'
})
export class MyRecipesComponent {
  private recipeService = inject(RecipeService);
  private userService = inject(UserService);
  list: any[] = [];
  user_id:any;


  constructor(private route: ActivatedRoute){}
  ngOnInit(): void {
    const token: string | null = localStorage.getItem('mytoken');
    if (token) {
      this.user_id = this.userService.getUserIdFromToken(token);
      console.log("userId",this.user_id);

      console.log('User ID:', this.user_id);
    } else {
      console.error('Token is null');
    }
    this.route.queryParams.subscribe(params => {
      if (params['array']) {
        this.list = JSON.parse(params['array']);
        //console.log("recipes from params", this.list);
        this.filterPublicRecipes(this.user_id);
      } else {
        this.recipeService.getAll().subscribe((data) => {
          this.list = data as any[];
          //console.log("recipes from service", data);
          this.filterPublicRecipes(this.user_id);
        });
      }
    });
  }

  private filterPublicRecipes(id:number): void {
    this.list = this.list.filter(recipe => recipe.addedByuser==id);
    console.log("my recipes",this.list);
    
  }
}
