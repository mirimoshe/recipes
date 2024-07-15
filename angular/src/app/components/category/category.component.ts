import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  colors: string[] = ['rgba(229, 139, 21, 0.838)', 'rgba(233, 160, 14, 0.82)', 'rgba(229, 139, 21, 0.714)'];
  randomColor: string = '';
  @Input() description?: string;
  private categoriesService = inject(CategoryService);
  list: any[] = [];

  ngOnInit(): void {
    this.randomColor = this.getRandomColor();
  }
  constructor(private router: Router) {}

  getRandomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  getRecipes(category: string | undefined) {
    if (category !== undefined) {
      this.categoriesService.getRecipesbyCategory(category).subscribe(
        (data) => {
          this.list = data as any[];
          console.log("categories", data);
          (this.router).navigate(['/recipes'], { queryParams: { array: JSON.stringify(this.list) } });
        },
        (error) => {
          console.error("Error fetching recipes:", error);
        }
      );
    } else {
      console.error("Category description is undefined.");
      // Optionally, handle the case where category is undefined
    }
  }



}
