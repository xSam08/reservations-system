import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Room {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  capacity: number;
  isAvailable: boolean;
  imageUrl: string;
}

interface RoomFilters {
  type: string;
  minPrice: number;
  maxPrice: number;
}

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  roomTypes: string[] = ['SINGLE', 'DOUBLE', 'TWIN', 'SUITE', 'DELUXE'];
  filters: RoomFilters = {
    type: '',
    minPrice: 0,
    maxPrice: 1000
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Simulated data - would normally come from a service
    this.rooms = [
      {
        id: '1',
        name: 'Deluxe Ocean View',
        description: 'Spacious room with stunning ocean views and private balcony',
        type: 'DELUXE',
        price: 299,
        capacity: 2,
        isAvailable: true,
        imageUrl: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
      },
      {
        id: '2',
        name: 'Standard Twin Room',
        description: 'Comfortable twin room with city views',
        type: 'TWIN',
        price: 199,
        capacity: 2,
        isAvailable: true,
        imageUrl: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
      },
      {
        id: '3',
        name: 'Executive Suite',
        description: 'Luxurious suite with separate living area',
        type: 'SUITE',
        price: 399,
        capacity: 3,
        isAvailable: false,
        imageUrl: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg'
      }
    ];
  }

  get filteredRooms(): Room[] {
    return this.rooms.filter(room => {
      const matchesType = !this.filters.type || room.type === this.filters.type;
      const matchesPrice = room.price >= this.filters.minPrice && room.price <= this.filters.maxPrice;
      return matchesType && matchesPrice;
    });
  }

  bookRoom(room: Room): void {
    if (room.isAvailable) {
      this.router.navigate(['/reservation'], { 
        queryParams: { 
          roomId: room.id,
          price: room.price
        }
      });
    }
  }
}