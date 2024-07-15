import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-aboutpage',
  standalone: true,
  imports: [NgFor],
  templateUrl: './aboutpage.component.html',
  styleUrl: './aboutpage.component.scss'
})
export class AboutpageComponent implements OnInit {
  timeline = [
    { year: '2020', event: 'Started my culinary journey' },
    { year: '2021', event: 'Launched my first recipe blog' },
    { year: '2022', event: 'Published my first cookbook' },
    // Add more timeline items as needed
  ];

  featuredRecipes = [
    { title: 'Vintage Apple Pie', description: 'A classic dessert with a twist.', image: 'assets/apple-pie.jpg' },
    { title: 'Old-Fashioned Lemonade', description: 'Refreshing and timeless.', image: 'assets/lemonade.jpg' },
    // Add more recipes as needed
  ];

  constructor() { }

  ngOnInit(): void { }
}
