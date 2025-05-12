// Angular routing module
import { Routes } from '@angular/router';

// Import all components
import { MainComponent } from './Components/main/main.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HotelsComponent } from './Components/hotels/hotels.component';
import { ReservationComponent } from './Components/reservation/reservation.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { RoomsComponent } from './Components/rooms/rooms.component';
import { ReportsComponent } from './Components/reports/reports.component';
import { ReviewsComponent } from './Components/reviews/reviews.component';

// Define the routes for the application
export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'hotels', component: HotelsComponent },
    { path: 'rooms', component: RoomsComponent },
    { path: 'reservation', component: ReservationComponent },
    { path: 'payment', component: ReservationComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'reviews', component: ReviewsComponent },
    { path: '**', component: NotfoundComponent }
];
