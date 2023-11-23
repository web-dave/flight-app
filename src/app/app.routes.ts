import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const APP_ROUTES: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    resolve: {
      user: () => inject(HttpClient).get('https://swapi.dev/api/people/1'),
    },
  },
  {
    path: 'flight-search',
    loadChildren: () => import('./flight-booking/flight.routes'),
  },
];
