import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { MainComponent } from './Components/main/main.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HotelsComponent } from './Components/hotels/hotels.component';
import { RoomsComponent } from './Components/rooms/rooms.component';
import { ReservationComponent } from './Components/reservation/reservation.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { ReviewsComponent } from './Components/reviews/reviews.component';
import { ReportsComponent } from './Components/reports/reports.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { FooterComponent } from './Components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MainComponent,
    LoginComponent,
    RegisterComponent,
    HotelsComponent,
    RoomsComponent,
    ReservationComponent,
    PaymentComponent,
    ReviewsComponent,
    ReportsComponent,
    NotfoundComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Hotel Reservation System';
}