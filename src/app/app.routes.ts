import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ConfigService } from './shared/config.service';
import { MeComponent } from './shared/me/me.component';
import { FooterMeComponent } from './shared/footer-me/footer-me.component';
import { goAwayGuard } from './shared/go-away.guard';
import { debounceTime, map, of, timer } from 'rxjs';
import { BasketComponent } from './basket/basket.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [goAwayGuard],
  },
  {
    path: 'basket',
    component: BasketComponent,
    outlet: 'aux',
  },
  {
    path: '',
    resolve: {
      config: () => inject(ConfigService).loaded$,
    },
    children: [
      {
        path: 'flight-booking',
        loadChildren: () => import('./flight-booking/flight-booking.routes'),
      },
      {
        path: 'next-flights',
        loadChildren: () => import('./next-flights/next-flights.module'),
      },
      {
        path: 'about',
        component: AboutComponent,
        resolve: {
          userData: () =>
            timer(1500).pipe(map(() => ({ name: 'Ammon', age: 26 }))),
        },
        children: [
          {
            path: '',
            component: MeComponent,
          },
          {
            path: '',
            component: FooterMeComponent,
            outlet: 'about-footer',
          },
        ],
      },

      // This _needs_ to be the last route!!
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];
