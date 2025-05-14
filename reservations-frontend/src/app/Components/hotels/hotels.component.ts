import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css'
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  searchTerm: string = '';
  selectedLocation: string = '';
  minPrice: number = 0;
  maxPrice: number = 1000;
  
  locations: string[] = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Las Vegas'];

  ngOnInit() {
    // Simulated data - replace with actual API call
    this.hotels = [
      {
        id: '1',
        name: 'Luxury Hotel & Spa',
        description: 'Experience ultimate luxury in the heart of the city',
        location: 'New York',
        rating: 4.8,
        price: 299,
        imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg'
      },
      {
        id: '2',
        name: 'Seaside Resort',
        description: 'Beautiful beachfront resort with stunning ocean views',
        location: 'Miami',
        rating: 4.5,
        price: 199,
        imageUrl: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'
      },
      {
        id: '3',
        name: 'Mountain Lodge',
        description: 'Cozy mountain retreat with spectacular views',
        location: 'Las Vegas',
        rating: 4.6,
        price: 249,
        imageUrl: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'
      }
    ];
  }

  get filteredHotels() {
    return this.hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          hotel.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesLocation = !this.selectedLocation || hotel.location === this.selectedLocation;
      const matchesPrice = hotel.price >= this.minPrice && hotel.price <= this.maxPrice;
      
      return matchesSearch && matchesLocation && matchesPrice;
    });
  }

  makeReservation(hotelId: string) {
    // Navigate to reservation page with hotel ID
    window.location.href = `/reservation?hotelId=${hotelId}`;
  }
}