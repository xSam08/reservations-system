import { Routes } from '@angular/router';

// Import all components
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

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    component: MainComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'hotels', 
    component: HotelsComponent 
  },
  { 
    path: 'rooms', 
    component: RoomsComponent 
  },
  { 
    path: 'reservation', 
    component: ReservationComponent 
  },
  { 
    path: 'payment', 
    component: PaymentComponent 
  },
  { 
    path: 'reviews', 
    component: ReviewsComponent 
  },
  { 
    path: 'reports', 
    component: ReportsComponent 
  },
  { 
    path: '**', 
    component: NotfoundComponent 
  }
];