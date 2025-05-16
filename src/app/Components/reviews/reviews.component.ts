import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Review {
  id: string;
  hotelId: string;
  customerId: string;
  customerName: string;
  rating: number;
  content: string;
  date: string;
}

interface Hotel {
  id: string;
  name: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  hotels: Hotel[] = [];
  selectedHotel: string = '';
  selectedRating: number | '' = '';

  ngOnInit(): void {
    // Simulated hotels data
    this.hotels = [
      { id: '1', name: 'Luxury Resort & Spa' },
      { id: '2', name: 'Mountain Lodge Retreat' },
      { id: '3', name: 'Urban Boutique Hotel' }
    ];

    // Simulated reviews data
    this.reviews = [
      {
        id: '1',
        hotelId: '1',
        customerId: 'user1',
        customerName: 'John Smith',
        rating: 5,
        content: 'Amazing experience! The ocean view was breathtaking and the service was impeccable.',
        date: '2024-04-01'
      },
      {
        id: '2',
        hotelId: '2',
        customerId: 'user2',
        customerName: 'Emma Wilson',
        rating: 4,
        content: 'Beautiful mountain location and cozy rooms. Perfect for a weekend getaway.',
        date: '2024-03-28'
      },
      {
        id: '3',
        hotelId: '3',
        customerId: 'user3',
        customerName: 'Michael Brown',
        rating: 5,
        content: 'Excellent location in the heart of the city. Modern amenities and friendly staff.',
        date: '2024-03-25'
      }
    ];
  }

  get filteredReviews(): Review[] {
    return this.reviews.filter(review => {
      const matchesHotel = !this.selectedHotel || review.hotelId === this.selectedHotel;
      const matchesRating = this.selectedRating === '' || review.rating === this.selectedRating;
      return matchesHotel && matchesRating;
    });
  }
}