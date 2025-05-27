import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service/auth-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  role: string | null = null;
  isMenuOpen: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado de login
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.role = this.authService.getRole(); // se actualiza dinámicamente
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    sessionStorage.clear();
    this.isLoggedIn = false;
    this.role = null;
    this.router.navigate(['/login']);
  }
}