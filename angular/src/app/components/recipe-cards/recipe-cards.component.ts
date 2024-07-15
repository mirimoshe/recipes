import { Component, OnInit, inject } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-recipe-cards',
  standalone: true,
  imports: [CommonModule,RecipeCardComponent],
  templateUrl: './recipe-cards.component.html',
  styleUrl: './recipe-cards.component.scss'
})
export class RecipeCardsComponent implements OnInit{
  private recipeService = inject(RecipeService);
  list: any[] = [];

  constructor(private route: ActivatedRoute){}

  // ngOnInit(): void {
  //   this.recipeService.getAll().subscribe((data) => {
  //     this.list = data as any[];
  //     console.log("recipes",data);
  //   });
  // }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['array']) {
        this.list = JSON.parse(params['array']);
        //console.log("recipes from params", this.list);
        this.filterPublicRecipes();
      } else {
        this.recipeService.getAll().subscribe((data) => {
          this.list = data as any[];
          //console.log("recipes from service", data);
          this.filterPublicRecipes();
        });
      }
    });
  }

  private filterPublicRecipes(): void {
    this.list = this.list.filter(recipe => !recipe.isPrivate);
  }
}
