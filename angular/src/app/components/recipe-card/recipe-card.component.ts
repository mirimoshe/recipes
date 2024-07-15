import { Component, Input, input } from '@angular/core';
import { MaterialIcon } from 'material-icons';
import { TimeFormatterPipe } from '../../pipes/time-formatter.pipe';
import { Router } from '@angular/router';
//import chipes from '../../../assets/chipes.png';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [TimeFormatterPipe],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss'
})
export class RecipeCardComponent {
  @Input() recipeName?: string
  @Input() prepTime?: number;
  @Input() dishes?: number;
  @Input() recipeId?: number;


  imageSources: string[] = ["assets/chipes.png", "assets/sandwitch.png", "assets/borito.png", "assets/forkAknife.png", "assets/groceries.png", "assets/salad.png"]
  selectedImageSource: string = '';

  constructor( private router: Router) { }

  ngOnInit(): void {
    // Initialize with a random image on component initialization
    this.selectRandomImage();
  }

  // Method to select a random image from the array
  selectRandomImage() {
    const randomIndex = Math.floor(Math.random() * this.imageSources.length);
    this.selectedImageSource = this.imageSources[randomIndex];
  }

  navigetToRecipe() {
    this.router.navigate([`/recipepage/${this.recipeId}`]);

  }
}
