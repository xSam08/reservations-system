import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH';
  transactionId?: string;
  paymentGateway?: string;
  paymentDate?: string;
  refundDate?: string;
  failureReason?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  reservationId: string;
  amount: number;
  currency: string;
  paymentMethod: Payment['paymentMethod'];
  metadata?: any;
}

export interface ProcessPaymentDto {
  paymentId: string;
  paymentDetails: {
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    cardHolderName?: string;
    email?: string;
    bankAccount?: string;
  };
}

export interface RefundPaymentDto {
  paymentId: string;
  amount?: number;
  reason: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsServiceService {
  private apiUrl = 'http://localhost:3000/api/payments';

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

  createPayment(payment: CreatePaymentDto): Observable<{ success: boolean; message: string; data: Payment }> {
    return this.http.post<{ success: boolean; message: string; data: Payment }>(
      `${this.apiUrl}/create`, 
      payment, 
      { headers: this.getAuthHeaders() }
    );
  }

  processPayment(paymentData: ProcessPaymentDto): Observable<{ success: boolean; message: string; data: Payment }> {
    return this.http.post<{ success: boolean; message: string; data: Payment }>(
      `${this.apiUrl}/process`, 
      paymentData, 
      { headers: this.getAuthHeaders() }
    );
  }

  refundPayment(refundData: RefundPaymentDto): Observable<{ success: boolean; message: string; data: Payment }> {
    return this.http.post<{ success: boolean; message: string; data: Payment }>(
      `${this.apiUrl}/refund`, 
      refundData, 
      { headers: this.getAuthHeaders() }
    );
  }

  createPaymentIntent(data: {
    amount: number;
    currency: string;
    reservationId: string;
    metadata?: any;
  }): Observable<{ success: boolean; message: string; data: PaymentIntent }> {
    return this.http.post<{ success: boolean; message: string; data: PaymentIntent }>(
      `${this.apiUrl}/create-intent`, 
      data, 
      { headers: this.getAuthHeaders() }
    );
  }

  getPaymentById(id: string): Observable<{ success: boolean; message: string; data: Payment }> {
    return this.http.get<{ success: boolean; message: string; data: Payment }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  getPaymentsByReservation(reservationId: string): Observable<{ success: boolean; message: string; data: Payment[] }> {
    return this.http.get<{ success: boolean; message: string; data: Payment[] }>(
      `${this.apiUrl}/reservation/${reservationId}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  getPayments(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentMethod?: string;
    dateFrom?: string;
    dateTo?: string;
    reservationId?: string;
  }): Observable<{ 
    success: boolean; 
    message: string; 
    data: { 
      payments: Payment[]; 
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  }> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value !== undefined && value !== null) {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get<{ 
      success: boolean; 
      message: string; 
      data: { 
        payments: Payment[]; 
        pagination?: any;
      };
    }>(this.apiUrl, { 
      headers: this.getAuthHeaders(),
      params 
    });
  }

  canRefund(payment: Payment): boolean {
    return payment.status === 'COMPLETED' && !payment.refundDate;
  }

  formatAmount(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  getPaymentStatusInSpanish(status: Payment['status']): string {
    const statusMap = {
      'PENDING': 'Pendiente',
      'COMPLETED': 'Completado',
      'FAILED': 'Fallido',
      'REFUNDED': 'Reembolsado',
      'CANCELLED': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  getPaymentMethodInSpanish(method: Payment['paymentMethod']): string {
    const methodMap = {
      'CREDIT_CARD': 'Tarjeta de Crédito',
      'DEBIT_CARD': 'Tarjeta de Débito',
      'PAYPAL': 'PayPal',
      'BANK_TRANSFER': 'Transferencia Bancaria',
      'CASH': 'Efectivo'
    };
    return methodMap[method] || method;
  }

  validateCreditCard(cardData: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardHolderName: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 13) {
      errors.push('Número de tarjeta inválido');
    }

    const month = parseInt(cardData.expiryMonth);
    if (!month || month < 1 || month > 12) {
      errors.push('Mes de expiración inválido');
    }

    const year = parseInt(cardData.expiryYear);
    const currentYear = new Date().getFullYear();
    if (!year || year < currentYear || year > currentYear + 20) {
      errors.push('Año de expiración inválido');
    }

    if (!cardData.cvv || cardData.cvv.length < 3 || cardData.cvv.length > 4) {
      errors.push('CVV inválido');
    }

    if (!cardData.cardHolderName || cardData.cardHolderName.trim().length < 2) {
      errors.push('Nombre del titular requerido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}