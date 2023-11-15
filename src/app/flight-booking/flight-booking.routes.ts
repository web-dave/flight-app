import { Routes } from '@angular/router';
import { provideLogger } from '../shared/logger/provider';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { PassengerSearchComponent } from './passenger-search/passenger-search.component';
import { FlightBookingComponent } from './flight-booking.component';
import { authGuard } from '../shared/auth/auth.service';

export const FLIGHT_BOOKING_ROUTES: Routes = [
  {
    path: '',
    component: FlightBookingComponent,
    providers: [
      provideLogger({
        formatter: (lvl, cat, msg) => [lvl, cat, msg].join(';'),
      }),
    ],
    children: [
      {
        path: '',
        redirectTo: 'flight-search',
        pathMatch: 'full',
      },
      {
        path: 'flight-search',
        component: FlightSearchComponent,
      },
      {
        path: 'flight-edit/:id',
        component: FlightEditComponent,
      },
      {
        path: 'passenger-search',
        component: PassengerSearchComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

export default FLIGHT_BOOKING_ROUTES;
