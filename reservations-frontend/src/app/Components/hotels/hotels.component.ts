import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HotelsServiceService, Hotel, HotelsResponse } from '../../Services/hotels-service/hotels-service.service';

// Interfaz extendida para compatibilidad con el template
interface HotelDisplay extends Hotel {
  imageUrl?: string;
  price?: number;
  location?: string;
}
import { ReviewsServiceService, ReviewStats } from '../../Services/reviews-service/reviews-service.service';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css'
})
export class HotelsComponent implements OnInit {
  hotels: HotelDisplay[] = [];
  filteredHotels: HotelDisplay[] = [];
  searchTerm: string = '';
  selectedLocation: string = ''; // Para compatibilidad con HTML
  selectedCity: string = '';
  selectedCountry: string = '';
  minRating: number = 0;
  minPrice: number = 0; // Para compatibilidad con HTML
  maxPrice: number = 1000; // Para compatibilidad con HTML
  sortBy: string = 'name';
  sortOrder: 'ASC' | 'DESC' = 'ASC';
  
  // Para compatibilidad con HTML
  locations: string[] = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Las Vegas'];
  
  // Estados de la aplicación
  loading: boolean = false;
  error: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 12;

  // Stats por hotel
  hotelStats: { [hotelId: string]: ReviewStats } = {};

  constructor(
    private hotelsService: HotelsServiceService,
    private reviewsService: ReviewsServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadHotels();
  }

  // Cargar hoteles del backend
  loadHotels() {
    this.loading = true;
    this.error = '';

    const filters = {
      page: this.currentPage,
      limit: this.limit,
      city: this.selectedCity || undefined,
      country: this.selectedCountry || undefined,
      minRating: this.minRating > 0 ? this.minRating : undefined,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };

    this.hotelsService.getHotels(filters).subscribe({
      next: (response: HotelsResponse) => {
        if (response.success) {
          // Mapear los datos del backend para compatibilidad con el template
          this.hotels = response.data.hotels.map(hotel => ({
            ...hotel,
            imageUrl: hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
            price: 199, // Precio por defecto - debería venir de las habitaciones
            location: `${hotel.address.city}, ${hotel.address.country}`
          }));
          this.filteredHotels = [...this.hotels];
          
          if (response.data.pagination) {
            this.currentPage = response.data.pagination.page;
            this.totalPages = response.data.pagination.totalPages;
          }

          // Cargar estadísticas de reseñas para cada hotel
          this.loadHotelStats();
        } else {
          this.error = response.message || 'Error al cargar hoteles';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.error = 'Error al conectar con el servidor';
        this.loading = false;
      }
    });
  }

  // Cargar estadísticas de reseñas para cada hotel
  loadHotelStats() {
    this.hotels.forEach(hotel => {
      this.reviewsService.getHotelReviewStats(hotel.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.hotelStats[hotel.id] = response.data;
          }
        },
        error: (error) => {
          console.error(`Error loading stats for hotel ${hotel.id}:`, error);
        }
      });
    });
  }

  // Buscar hoteles por texto
  searchHotels() {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.hotelsService.searchHotels(this.searchTerm).subscribe({
        next: (response: HotelsResponse) => {
          if (response.success) {
            // Mapear los datos del backend para compatibilidad con el template
            this.hotels = response.data.hotels.map(hotel => ({
              ...hotel,
              imageUrl: hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
              price: 199, // Precio por defecto - debería venir de las habitaciones
              location: `${hotel.address.city}, ${hotel.address.country}`
            }));
            this.filteredHotels = [...this.hotels];
            this.loadHotelStats();
          } else {
            this.error = response.message || 'Error en la búsqueda';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching hotels:', error);
          this.error = 'Error al buscar hoteles';
          this.loading = false;
        }
      });
    } else {
      this.loadHotels();
    }
  }

  // Aplicar filtros
  applyFilters() {
    this.currentPage = 1; // Resetear a primera página
    
    // Sincronizar selectedLocation con selectedCity para el backend
    if (this.selectedLocation) {
      this.selectedCity = this.selectedLocation;
    }
    
    this.loadHotels();
  }

  // Limpiar filtros
  clearFilters() {
    this.searchTerm = '';
    this.selectedLocation = '';
    this.selectedCity = '';
    this.selectedCountry = '';
    this.minRating = 0;
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.sortBy = 'name';
    this.sortOrder = 'ASC';
    this.currentPage = 1;
    this.loadHotels();
  }

  // Cambiar página
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadHotels();
    }
  }

  // Navegar a los detalles del hotel
  viewHotelDetails(hotelId: string) {
    this.router.navigate(['/hotel', hotelId]);
  }

  // Navegar a realizar reserva
  makeReservation(hotelId: string) {
    this.router.navigate(['/reservation'], { queryParams: { hotelId } });
  }

  // Obtener estadísticas de un hotel
  getHotelStats(hotelId: string): ReviewStats | null {
    return this.hotelStats[hotelId] || null;
  }

  // Formatear rating para mostrar
  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  // Obtener array para mostrar estrellas
  getStarsArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  // Obtener páginas para paginación
  getPagesArray(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}