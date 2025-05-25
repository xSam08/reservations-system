import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiUrl = 'http://localhost:3000/api/auth/';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  // Observador público para los componentes
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + "login", { email, password }).pipe(
      tap((response: any) => {
        console.log(response);
        
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('role', response.data.user.role);
        this.loggedIn.next(true);
      })
    );
  }

  // Método extra opcional
  getRole(): string | null {
    return sessionStorage.getItem('role');
  }
}