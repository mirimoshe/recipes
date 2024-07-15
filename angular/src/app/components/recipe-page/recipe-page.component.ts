import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { NgFor, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TimeFormatterPipe } from '../../pipes/time-formatter.pipe';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { BatteryPipe } from '../../pipes/battery.pipe';
import { UserService } from '../../services/user.service';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-recipe-page',
  standalone: true,
  imports: [NgFor, NgIf, MatIcon, TimeFormatterPipe, DateFormatPipe, BatteryPipe],
  templateUrl: './recipe-page.component.html',
  styleUrl: './recipe-page.component.scss'
})
export class RecipePageComponent implements OnInit {
  private userService = inject(UserService);
  constructor(private route: ActivatedRoute, private recipeservice: RecipeService) { }
  id: any;
  recipe: any;
  user: any;


  // ngOnInit(): void {
  //   this.id = this.route.snapshot.params['id'];
  //   this.recipeservice.getById(this.id).subscribe((data) => {
  //     this.recipe = data;
  //   });
  //   console.log("ttt",this.recipe);
  //   this.userService.getuserById(this.recipe.addedByuser).subscribe((data) => {
  //     this.user = data;
  //     console.log("aaa",this.user.userName);
  //   });
  // }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.recipeservice.getById(this.id).pipe(
      switchMap(recipe => {
        this.recipe = recipe;
        console.log("ttt", this.recipe);
        return this.userService.getuserById(this.recipe.addedByuser);
      })
    ).subscribe(user => {
      this.user = user;
      console.log("aaa", this.user.userName);
    });
  }

}
