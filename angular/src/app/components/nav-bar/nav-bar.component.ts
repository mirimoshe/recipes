import { Component, Inject, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule,NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit{
  onLoginClick() {
    console.log('Login link clicked');
  }

  private userService = inject(UserService);
  
  isLog  = false;

  ngOnInit(): void {
    this.userService.token$.subscribe(status => {
      this.isLog = status;
    });
  }

}
