import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  id: string;
  hotelId: string;
  type: string;
  description: string;
  capacity: number;
  basePrice: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  createdAt: string;
  updatedAt: string;
}

export interface RoomsResponse {
  success: boolean;
  message: string;
  data: {
    rooms: Room[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreateRoomDto {
  hotelId: string;
  type: string;
  description: string;
  capacity: number;
  basePrice: number;
  amenities: string[];
  images: string[];
}

export interface RoomAvailability {
  roomId: string;
  date: string;
  availableRooms: number;
  totalRooms: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoomsServiceService {
  private apiUrl = 'http://localhost:3000/api/rooms';

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

  // Obtener todas las habitaciones con filtros
  getRooms(filters?: {
    page?: number;
    limit?: number;
    hotelId?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    capacity?: number;
    available?: boolean;
  }): Observable<RoomsResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get<RoomsResponse>(this.apiUrl, { params });
  }

  // Obtener tipos de habitación disponibles
  getRoomTypes(): Observable<{ success: boolean; data: string[] }> {
    return this.http.get<{ success: boolean; data: string[] }>(`${this.apiUrl}/types`);
  }

  // Buscar habitaciones disponibles entre todos los hoteles
  searchRooms(filters: {
    checkIn: string;
    checkOut: string;
    guests?: number;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Observable<RoomsResponse> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof typeof filters];
      if (value !== undefined && value !== null) {
        params = params.append(key, value.toString());
      }
    });

    return this.http.get<RoomsResponse>(`${this.apiUrl}/search`, { params });
  }

  // Obtener habitación por ID
  getRoomById(id: string): Observable<{ success: boolean; message: string; data: Room }> {
    return this.http.get<{ success: boolean; message: string; data: Room }>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva habitación (requiere autenticación)
  createRoom(room: CreateRoomDto): Observable<{ success: boolean; message: string; data: Room }> {
    return this.http.post<{ success: boolean; message: string; data: Room }>(
      this.apiUrl, 
      room, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Actualizar habitación (requiere autenticación)
  updateRoom(id: string, room: Partial<CreateRoomDto>): Observable<{ success: boolean; message: string; data: Room }> {
    return this.http.patch<{ success: boolean; message: string; data: Room }>(
      `${this.apiUrl}/${id}`, 
      room, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Eliminar habitación (requiere autenticación)
  deleteRoom(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener disponibilidad de habitación
  getRoomAvailability(
    roomId: string, 
    startDate?: string, 
    endDate?: string
  ): Observable<{ success: boolean; data: RoomAvailability[] }> {
    let params = new HttpParams();
    if (startDate) params = params.append('startDate', startDate);
    if (endDate) params = params.append('endDate', endDate);

    return this.http.get<{ success: boolean; data: RoomAvailability[] }>(
      `${this.apiUrl}/${roomId}/availability`,
      { params }
    );
  }

  // Actualizar disponibilidad de habitación (requiere autenticación)
  updateRoomAvailability(
    roomId: string, 
    availability: { date: string; availableRooms: number; price: number }[]
  ): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/${roomId}/availability`, 
      { availability }, 
      { headers: this.getAuthHeaders() }
    );
  }

  // ===== RUTAS ESPECÍFICAS POR HOTEL =====

  // Obtener habitaciones de un hotel específico
  getHotelRooms(hotelId: string, filters?: {
    type?: string;
    available?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }): Observable<RoomsResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get<RoomsResponse>(`http://localhost:3000/api/hotels/${hotelId}/rooms`, { params });
  }

  // Crear habitación en hotel específico (requiere autenticación)
  createHotelRoom(hotelId: string, room: Omit<CreateRoomDto, 'hotelId'>): Observable<{ success: boolean; message: string; data: Room }> {
    return this.http.post<{ success: boolean; message: string; data: Room }>(
      `http://localhost:3000/api/hotels/${hotelId}/rooms`, 
      room, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener habitaciones disponibles para fechas específicas
  getAvailableHotelRooms(
    hotelId: string, 
    checkIn: string, 
    checkOut: string,
    guests?: number
  ): Observable<RoomsResponse> {
    let params = new HttpParams()
      .set('checkIn', checkIn)
      .set('checkOut', checkOut);
    
    if (guests) {
      params = params.append('guests', guests.toString());
    }

    return this.http.get<RoomsResponse>(
      `http://localhost:3000/api/hotels/${hotelId}/rooms/available`, 
      { params }
    );
  }
}