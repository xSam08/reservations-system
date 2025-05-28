import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  id: string;
  userId: string;
  hotelId: string;
  reservationId?: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  photos?: string[];
  helpful: number;
  verified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  hotel?: {
    id: string;
    name: string;
  };
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: Review[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreateReviewDto {
  hotelId: string;
  reservationId?: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  photos?: string[];
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
  recommendationPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsServiceService {
  private apiUrl = 'http://localhost:3000/api/reviews';

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

  getHealthStatus(): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.get<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/health`);
  }

  createReview(review: CreateReviewDto): Observable<{ success: boolean; message: string; data: Review }> {
    return this.http.post<{ success: boolean; message: string; data: Review }>(
      this.apiUrl, 
      review, 
      { headers: this.getAuthHeaders() }
    );
  }

  getReviews(filters?: {
    page?: number;
    limit?: number;
    hotelId?: string;
    userId?: string;
    rating?: number;
    minRating?: number;
    maxRating?: number;
    verified?: boolean;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    sortBy?: 'rating' | 'createdAt' | 'helpful';
    sortOrder?: 'ASC' | 'DESC';
  }): Observable<ReviewsResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get<ReviewsResponse>(`${this.apiUrl}/search`, { params });
  }

  getHotelReviewStats(hotelId: string): Observable<{ success: boolean; message: string; data: ReviewStats }> {
    return this.http.get<{ success: boolean; message: string; data: ReviewStats }>(
      `${this.apiUrl}/hotel/${hotelId}/stats`
    );
  }

  getReviewById(id: string): Observable<{ success: boolean; message: string; data: Review }> {
    return this.http.get<{ success: boolean; message: string; data: Review }>(
      `${this.apiUrl}/${id}`
    );
  }

  updateReview(id: string, updates: Partial<CreateReviewDto>): Observable<{ success: boolean; message: string; data: Review }> {
    return this.http.put<{ success: boolean; message: string; data: Review }>(
      `${this.apiUrl}/${id}`, 
      updates, 
      { headers: this.getAuthHeaders() }
    );
  }

  deleteReview(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  markReviewAsHelpful(id: string): Observable<{ success: boolean; message: string; data: Review }> {
    return this.http.post<{ success: boolean; message: string; data: Review }>(
      `${this.apiUrl}/${id}/helpful`, 
      {}, 
      { headers: this.getAuthHeaders() }
    );
  }

  getHotelReviews(hotelId: string, filters?: {
    page?: number;
    limit?: number;
    rating?: number;
    minRating?: number;
    maxRating?: number;
    verified?: boolean;
    sortBy?: 'rating' | 'createdAt' | 'helpful';
    sortOrder?: 'ASC' | 'DESC';
  }): Observable<ReviewsResponse> {
    const combinedFilters = { ...filters, hotelId };
    return this.getReviews(combinedFilters);
  }

  getMyReviews(): Observable<ReviewsResponse> {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }
    return this.getReviews({ userId });
  }

  validateReview(review: CreateReviewDto): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!review.hotelId || review.hotelId.trim().length === 0) {
      errors.push('ID del hotel es requerido');
    }

    if (!review.rating || review.rating < 1 || review.rating > 5) {
      errors.push('Calificación debe estar entre 1 y 5');
    }

    if (!review.title || review.title.trim().length < 5) {
      errors.push('Título debe tener al menos 5 caracteres');
    }

    if (!review.comment || review.comment.trim().length < 10) {
      errors.push('Comentario debe tener al menos 10 caracteres');
    }

    if (review.title && review.title.length > 100) {
      errors.push('Título no puede exceder 100 caracteres');
    }

    if (review.comment && review.comment.length > 1000) {
      errors.push('Comentario no puede exceder 1000 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '⭐' : '') + 
           '☆'.repeat(emptyStars);
  }

  getRatingDescription(rating: number): string {
    if (rating >= 4.5) return 'Excelente';
    if (rating >= 3.5) return 'Muy bueno';
    if (rating >= 2.5) return 'Bueno';
    if (rating >= 1.5) return 'Regular';
    return 'Malo';
  }

  formatReviewDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  }

  calculateRecommendationPercentage(stats: ReviewStats): number {
    if (stats.totalReviews === 0) return 0;
    
    const positiveReviews = stats.ratingDistribution[4] + stats.ratingDistribution[5];
    return Math.round((positiveReviews / stats.totalReviews) * 100);
  }
}