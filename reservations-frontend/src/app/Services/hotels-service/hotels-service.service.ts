import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  rating: number;
  amenities: string[];
  photos: string[];
  ownerId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

export interface HotelsResponse {
  success: boolean;
  message: string;
  data: {
    hotels: Hotel[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreateHotelDto {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  amenities: string[];
  photos: string[];
}

@Injectable({
  providedIn: 'root'
})
export class HotelsServiceService {
  private apiUrl = 'http://localhost:3000/api/hotels';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    const role = sessionStorage.getItem('role');
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-user-id': userId || '',
      'x-user-role': role || ''
    });
  }

  // Obtener todos los hoteles con filtros y paginación
  getHotels(filters?: {
    page?: number;
    limit?: number;
    city?: string;
    country?: string;
    minRating?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Observable<HotelsResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get<HotelsResponse>(this.apiUrl, { params });
  }

  // Buscar hoteles por nombre/descripción/ubicación
  searchHotels(query: string): Observable<HotelsResponse> {
    const params = new HttpParams().set('q', query);
    return this.http.get<HotelsResponse>(`${this.apiUrl}/search`, { params });
  }

  // Obtener hotel por ID
  getHotelById(id: string): Observable<{ success: boolean; message: string; data: Hotel }> {
    return this.http.get<{ success: boolean; message: string; data: Hotel }>(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo hotel (requiere autenticación)
  createHotel(hotel: CreateHotelDto): Observable<{ success: boolean; message: string; data: Hotel }> {
    return this.http.post<{ success: boolean; message: string; data: Hotel }>(
      this.apiUrl, 
      hotel, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Actualizar hotel (requiere autenticación)
  updateHotel(id: string, hotel: Partial<CreateHotelDto>): Observable<{ success: boolean; message: string; data: Hotel }> {
    return this.http.patch<{ success: boolean; message: string; data: Hotel }>(
      `${this.apiUrl}/${id}`, 
      hotel, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Eliminar hotel (requiere autenticación)
  deleteHotel(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener hoteles del usuario actual (requiere autenticación)
  getMyHotels(): Observable<HotelsResponse> {
    return this.http.get<HotelsResponse>(
      `${this.apiUrl}/my-hotels`, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener hoteles por propietario
  getHotelsByOwner(ownerId: string): Observable<HotelsResponse> {
    return this.http.get<HotelsResponse>(`${this.apiUrl}/owner/${ownerId}`);
  }

  // Obtener habitaciones del hotel
  getHotelRooms(hotelId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${hotelId}/rooms`);
  }

  // Obtener reservas del hotel (requiere autenticación)
  getHotelReservations(hotelId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${hotelId}/reservations`, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener estadísticas del hotel (requiere autenticación)
  getHotelStatistics(hotelId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${hotelId}/statistics`, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Actualizar estado del hotel (solo admin)
  updateHotelStatus(hotelId: string, status: 'ACTIVE' | 'INACTIVE' | 'PENDING'): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${hotelId}/status`, 
      { status }, 
      { headers: this.getAuthHeaders() }
    );
  }
}
