import { Routes } from '@angular/router';
import { ReservationPageComponent } from './reservation-page/reservation-page.component';
import { BookingPageComponent } from './booking-page/booking-page';
import { RouterModule } from '@angular/router';


export const routes: Routes = [
  { path: '', component: ReservationPageComponent },
  { path: 'booking/:id', component: BookingPageComponent },
];