import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'HOTEL_ADMIN' | 'ADMIN';
  isEmailVerified: boolean;
  isActive: boolean;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  preferences?: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UpdateUserProfileDto {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  preferences?: {
    language?: string;
    currency?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsersServiceService {
  private apiUrl = 'http://localhost:3000/api/users';

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

  getCurrentUserProfile(): Observable<{ success: boolean; message: string; data: User }> {
    return this.http.get<{ success: boolean; message: string; data: User }>(
      `${this.apiUrl}/profile`, 
      { headers: this.getAuthHeaders() }
    );
  }

  updateCurrentUserProfile(updates: UpdateUserProfileDto): Observable<{ success: boolean; message: string; data: User }> {
    return this.http.patch<{ success: boolean; message: string; data: User }>(
      `${this.apiUrl}/profile`, 
      updates, 
      { headers: this.getAuthHeaders() }
    );
  }

  getAllUsers(filters?: {
    page?: number;
    limit?: number;
    role?: 'CUSTOMER' | 'HOTEL_ADMIN' | 'ADMIN';
    isActive?: boolean;
    isEmailVerified?: boolean;
    search?: string;
    sortBy?: 'name' | 'email' | 'createdAt';
    sortOrder?: 'ASC' | 'DESC';
  }): Observable<UsersResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get<UsersResponse>(this.apiUrl, { 
      headers: this.getAuthHeaders(),
      params 
    });
  }

  getUserById(id: string): Observable<{ success: boolean; message: string; data: User }> {
    return this.http.get<{ success: boolean; message: string; data: User }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  updateUserById(id: string, updates: Partial<UpdateUserProfileDto & { role?: User['role']; isActive?: boolean }>): Observable<{ success: boolean; message: string; data: User }> {
    return this.http.patch<{ success: boolean; message: string; data: User }>(
      `${this.apiUrl}/${id}`, 
      updates, 
      { headers: this.getAuthHeaders() }
    );
  }

  deleteUserById(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  getUserReservations(userId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${userId}/reservations`, 
      { headers: this.getAuthHeaders() }
    );
  }

  getHotelOwners(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(
      `${this.apiUrl}/hotel-owners`, 
      { headers: this.getAuthHeaders() }
    );
  }

  getCustomers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(
      `${this.apiUrl}/customers`, 
      { headers: this.getAuthHeaders() }
    );
  }

  updateUserStatus(userId: string, status: { isActive?: boolean; isEmailVerified?: boolean }): Observable<{ success: boolean; message: string; data: User }> {
    return this.http.patch<{ success: boolean; message: string; data: User }>(
      `${this.apiUrl}/${userId}/status`, 
      status, 
      { headers: this.getAuthHeaders() }
    );
  }

  isCurrentUserAdmin(): boolean {
    const role = sessionStorage.getItem('role');
    return role === 'ADMIN';
  }

  isCurrentUserHotelAdmin(): boolean {
    const role = sessionStorage.getItem('role');
    return role === 'HOTEL_ADMIN';
  }

  isCurrentUserCustomer(): boolean {
    const role = sessionStorage.getItem('role');
    return role === 'CUSTOMER';
  }

  getCurrentUserRoleInSpanish(): string {
    const role = sessionStorage.getItem('role');
    const roleMap = {
      'ADMIN': 'Administrador',
      'HOTEL_ADMIN': 'Administrador de Hotel',
      'CUSTOMER': 'Cliente'
    };
    return roleMap[role as keyof typeof roleMap] || 'Desconocido';
  }

  getCurrentUserName(): string {
    return sessionStorage.getItem('name') || 'Usuario';
  }

  getCurrentUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

  validateProfileData(profileData: UpdateUserProfileDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (profileData.name && profileData.name.trim().length < 2) {
      errors.push('Nombre debe tener al menos 2 caracteres');
    }

    if (profileData.phone && profileData.phone.length < 10) {
      errors.push('Teléfono debe tener al menos 10 dígitos');
    }

    if (profileData.dateOfBirth) {
      const birthDate = new Date(profileData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        errors.push('Debe ser mayor de 18 años');
      }
      
      if (age > 120) {
        errors.push('Fecha de nacimiento inválida');
      }
    }

    if (profileData.address?.zipCode && profileData.address.zipCode.length < 3) {
      errors.push('Código postal inválido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  formatDateOfBirth(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  canUserPerformAction(action: 'CREATE_HOTEL' | 'MANAGE_USERS' | 'VIEW_REPORTS'): boolean {
    const role = sessionStorage.getItem('role');
    
    const permissions = {
      'CREATE_HOTEL': ['HOTEL_ADMIN', 'ADMIN'],
      'MANAGE_USERS': ['ADMIN'],
      'VIEW_REPORTS': ['HOTEL_ADMIN', 'ADMIN']
    };
    
    return permissions[action].includes(role || '');
  }
}