import { Component, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryComponent } from '../category/category.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,CategoryComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  private categoriesService = inject(CategoryService);
  list: any[] = [];

  ngOnInit(): void {
    this.categoriesService.getAll().subscribe((data) => {
      this.list = data as any[];
      console.log("categories",data);
    });
  }
}
