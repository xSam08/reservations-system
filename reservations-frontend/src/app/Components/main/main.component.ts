import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FeaturedHotel {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  imageUrl: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  featuredHotels: FeaturedHotel[] = [
    {
      id: '1',
      name: 'Luxury Resort & Spa',
      description: 'Experience ultimate luxury in our 5-star resort with stunning ocean views and world-class amenities.',
      location: 'Maldives',
      date: '2024-04-15',
      imageUrl: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'
    },
    {
      id: '2',
      name: 'Mountain Lodge Retreat',
      description: 'Escape to our serene mountain lodge surrounded by nature and breathtaking views.',
      location: 'Swiss Alps',
      date: '2024-04-14',
      imageUrl: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'
    },
    {
      id: '3',
      name: 'Urban Boutique Hotel',
      description: 'Stay in the heart of the city in our stylish boutique hotel with modern amenities.',
      location: 'New York',
      date: '2024-04-13',
      imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg'
    }
  ];

  ngOnInit(): void {
    // Any initialization logic can go here
  }
}