import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
  specialRequests?: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
  // Datos relacionados
  hotel?: any;
  room?: any;
  user?: any;
}

export interface ReservationsResponse {
  success: boolean;
  message: string;
  data: {
    reservations: Reservation[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreateReservationDto {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReservationsServiceService {
  private apiUrl = 'http://localhost:3000/api/reservations';

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

  // Obtener todas las reservas con filtros (requiere autenticación)
  getReservations(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    hotelId?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<ReservationsResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get<ReservationsResponse>(this.apiUrl, { 
      headers: this.getAuthHeaders(),
      params 
    });
  }

  // Crear nueva reserva (requiere autenticación)
  createReservation(reservation: CreateReservationDto): Observable<{ success: boolean; message: string; data: Reservation }> {
    return this.http.post<{ success: boolean; message: string; data: Reservation }>(
      this.apiUrl, 
      reservation, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener reservas pendientes (requiere autenticación)
  getPendingReservations(): Observable<ReservationsResponse> {
    return this.http.get<ReservationsResponse>(
      `${this.apiUrl}/pending`, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener historial de reservas (requiere autenticación)
  getReservationsHistory(): Observable<ReservationsResponse> {
    return this.http.get<ReservationsResponse>(
      `${this.apiUrl}/history`, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener reservas por usuario (requiere autenticación)
  getUserReservations(userId: string): Observable<ReservationsResponse> {
    return this.http.get<ReservationsResponse>(
      `${this.apiUrl}/user/${userId}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener reservas por hotel (requiere autenticación)
  getHotelReservations(hotelId: string): Observable<ReservationsResponse> {
    return this.http.get<ReservationsResponse>(
      `${this.apiUrl}/hotel/${hotelId}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Obtener reserva por ID (requiere autenticación)
  getReservationById(id: string): Observable<{ success: boolean; message: string; data: Reservation }> {
    return this.http.get<{ success: boolean; message: string; data: Reservation }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Actualizar reserva por ID (requiere autenticación)
  updateReservation(id: string, updates: Partial<CreateReservationDto>): Observable<{ success: boolean; message: string; data: Reservation }> {
    return this.http.put<{ success: boolean; message: string; data: Reservation }>(
      `${this.apiUrl}/${id}`, 
      updates, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Eliminar reserva por ID (requiere autenticación)
  deleteReservation(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Actualizar estado de reserva (requiere autenticación)
  updateReservationStatus(id: string, status: Reservation['status']): Observable<{ success: boolean; message: string; data: Reservation }> {
    return this.http.put<{ success: boolean; message: string; data: Reservation }>(
      `${this.apiUrl}/${id}/status`, 
      { status }, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Confirmar reserva (requiere autenticación)
  confirmReservation(id: string): Observable<{ success: boolean; message: string; data: Reservation }> {
    return this.http.post<{ success: boolean; message: string; data: Reservation }>(
      `${this.apiUrl}/${id}/confirm`, 
      {}, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Rechazar reserva (requiere autenticación)
  rejectReservation(id: string, reason?: string): Observable<{ success: boolean; message: string; data: Reservation }> {
    return this.http.post<{ success: boolean; message: string; data: Reservation }>(
      `${this.apiUrl}/${id}/reject`, 
      { reason }, 
      { headers: this.getAuthHeaders() }
    );
  }

  // Cancelar reserva (requiere autenticación)
  cancelReservation(id: string, reason?: string): Observable<{ success: boolean; message: string; data: Reservation }> {
    return this.http.post<{ success: boolean; message: string; data: Reservation }>(
      `${this.apiUrl}/${id}/cancel`, 
      { reason }, 
      { headers: this.getAuthHeaders() }
    );
  }

  // ===== MÉTODOS DE UTILIDAD =====

  // Obtener mis reservas (del usuario actual)
  getMyReservations(): Observable<ReservationsResponse> {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }
    return this.getUserReservations(userId);
  }

  // Verificar si se puede cancelar una reserva
  canCancelReservation(reservation: Reservation): boolean {
    const checkInDate = new Date(reservation.checkIn);
    const today = new Date();
    const daysBetween = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    return daysBetween >= 1 && (reservation.status === 'PENDING' || reservation.status === 'CONFIRMED');
  }

  // Calcular días de estadía
  calculateStayDays(checkIn: string, checkOut: string): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
  }
}