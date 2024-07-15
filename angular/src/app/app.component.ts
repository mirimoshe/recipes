import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserService } from './services/user.service';
import { AddResipeComponent } from './components/add-resipe/add-resipe.component';
import { CommonModule } from '@angular/common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatStepperModule} from '@angular/material/stepper';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RecipeService } from './services/recipe.service';
import { CategoryComponent } from './components/category/category.component';
import { TimeFormatterPipe } from './pipes/time-formatter.pipe';
import { HomepageComponent } from './components/homepage/homepage.component';
import { Router } from 'express';
import { RecipePageComponent } from './components/recipe-page/recipe-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TimeFormatterPipe,CommonModule,RouterModule,LoginComponent,CategoryComponent,NavBarComponent,AddResipeComponent,CommonModule,MatSlideToggleModule,MatStepperModule,ReactiveFormsModule,HomepageComponent,RecipePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'recipes-project';
  private userService=inject(UserService);
  private recipeService=inject(RecipeService)
}
// RouterOutlet