# Routing: Deep Dive

[[TOC]]

For this lab, checkout the branch `lab305-routing-starter`:

```
git add *
git stash
git checkout lab305-routing-starter
```

## Child Routes

In this lab, you add a `FlightBookingComponent` that loads the `FlightSearchComponent` and the `FlightPassengerComponent` into its `router-outlet`.

1. Add a `FlightBookingComponent`:

   ```bash
   ng g c flight-booking --standalone
   ```

1. Open the file `flight-booking.component.ts` (`src/app/flight-booking/flight-booking.component.ts`) and import the `RouterLink` as well as the `RouterOutlet`:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { Component } from "@angular/core";
   import { CommonModule } from "@angular/common";
   import { RouterLink, RouterOutlet } from "@angular/router";

   @Component({
     selector: "app-flight-booking",
     standalone: true,
     imports: [CommonModule, RouterLink, RouterOutlet],
     templateUrl: "./flight-booking.component.html",
     styleUrls: ["./flight-booking.component.css"],
   })
   export class FlightBookingComponent {}
   ```

   </details><br>

1. Switch to the file `flight-booking.component.html` (`src/app/flight-booking/flight-booking.component.html`) and add links for loading the `FlightSearchComponent` and the `FlightPassengerComponent` as subroutes. Also, add a `router-outlet`:

   <details>
   <summary>Show Code</summary>

   ```html
   <div class="card">
     <div class="card-body">
       <ul class="nav nav-secondary">
         <li routerLinkActive="active">
           <a [routerLink]="['./flight-search']">Flight</a>
         </li>

         &nbsp; | &nbsp;

         <li routerLinkActive="active">
           <a [routerLink]="['./passenger-search']">Passenger</a>
         </li>
       </ul>
     </div>
   </div>

   <router-outlet></router-outlet>
   ```

   </details><br>

1. Open the file `flight-booking.routes.ts` (`src/app/flight-booking/flight-booking.routes.ts`) and make sure the new `FlightBookingComponent` is used by the parent route containing the further ones. Also, add a default route to the sub routes:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { Routes } from '@angular/router';
    import { provideLogger } from '../shared/logger/provider';
   +import { FlightBookingComponent } from './flight-booking.component';
    import { FlightEditComponent } from './flight-edit/flight-edit.component';
    import { FlightSearchComponent } from './flight-search/flight-search.component';
    import { PassengerSearchComponent } from './passenger-search/passenger-search.component';

   [...]

    export const FLIGHT_BOOKING_ROUTES: Routes = [
      {
        path: '',
   +    component: FlightBookingComponent,
        providers: [
          provideLogger({
            formatter: (lvl, cat, msg) => [lvl, cat, msg].join(';'),
          }),
        ],
        children: [
   +      {
   +        path: '',
   +        redirectTo: 'flight-search',
   +        pathMatch: 'full',
   +      },
          {
            path: 'flight-search',
            component: FlightSearchComponent,
   ```

   </details><br>

1. Open the file `sidebar.component.html` (`src/app/sidebar/sidebar.component.html`) and switch out the hyperlinks for routing `flight-search` and `passenger-search` for a link pointing to `flight-booking`:

   <details>
   <summary>Show Code</summary>

   ```diff
    </li>

        <li>
   -      <a routerLink="flight-booking/flight-search">
   +      <a routerLink="flight-booking">
            <p>Flights</p>
          </a>
        </li>

   -    <li>
   -      <a routerLink="flight-booking/passenger-search">
   -        <p>Passengers</p>
   -      </a>
   -    </li>
   -
        <li>
          <a routerLink="next-flights">
            <p>Next Flights</p>
   ```

   </details><br>

1. Test your modifications:

   ```bash
   ng serve -o
   ```

## Aux Routes

Now, let's add an aux route that displays the `BasketComponent` that is already part of our project.

1. Open the file `app.component.html` (`src/app/app.component.html`) and add another `router-outlet` with the name `aux`:

   <details>
   <summary>Show Code</summary>

   ```diff
    <div class="content">
          <router-outlet></router-outlet>
        </div>
   +
   +    <router-outlet name="aux"></router-outlet>
      </div>
    </div>
   ```

   </details><br>

1. Switch to the file `app.routes.ts` (`src/app/app.routes.ts`) and add a route for the already existing `BasketComponent` and the `router-outlet` with the name `aux`.:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { inject } from '@angular/core';
    import { Routes } from '@angular/router';
    import { AboutComponent } from './about/about.component';
   +import { BasketComponent } from './basket/basket.component';
    import { HomeComponent } from './home/home.component';
    import { NotFoundComponent } from './not-found/not-found.component';
    import { ConfigService } from './shared/config.service';

   [...]

        path: 'home',
        component: HomeComponent,
      },
   -
   +  {
   +    path: 'basket',
   +    component: BasketComponent,
   +    outlet: 'aux',
   +  },
      {
        path: '',
        resolve: {
   ```

   </details><br>

1. Open the file `sidebar.component.html` (`src/app/sidebar/sidebar.component.html`) and add a hyperlink activating the new `aux` route:

   <details>
   <summary>Show Code</summary>

   ```diff
    </li>

        <li>
   -      <a>
   +      <a [routerLink]="[{ outlets: { aux: 'basket' } }]">
            <p>Basket</p>
          </a>
        </li>
   ```

   </details><br>

1. Switch to the file `basket.component.ts` (`src/app/basket/basket.component.ts`) and import the `RouterLink` directive:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { Component } from '@angular/core';
    import { CommonModule } from '@angular/common';
   +import { RouterLink } from '@angular/router';

    @Component({
      selector: 'app-basket',
      standalone: true,
   -  imports: [CommonModule],
   +  imports: [CommonModule, RouterLink],
      templateUrl: './basket.component.html',
      styleUrls: ['./basket.component.css'],
    })
   ```

   </details><br>

1. Open the file `basket.component.html` (`src/app/basket/basket.component.html`) and add a link that closes the aux route:

   <details>
   <summary>Show Code</summary>

   ```diff
    <p>Graz - Hamburg</p>
            </li>
          </ul>
   +
   +      <a
   +        [routerLink]="['/', { outlets: { aux: null } }]"
   +        class="btn btn-default"
   +      >
   +        Close
   +      </a>
        </div>
      </div>
    </div>
   ```

   </details><br>

1. Test your modifications:

   ```bash
   ng serve -o
   ```

## CanActivate Guard

In this lab, we implement a simple `CanActivate` guard that makes sure that only logged in users can activate the `passenger-search` route.

1. Create a file `auth.service.ts` (`src/app/shared/auth/auth.service.ts`) with an `AuthService` providing the name of the currently logged-in user:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { Injectable } from "@angular/core";

   @Injectable({
     providedIn: "root",
   })
   export class AuthService {
     private _userName = "";

     get userName(): string {
       return this._userName;
     }

     login(userName: string, password = ""): void {
       // Auth for *very honest* users TM
       this._userName = userName;
     }

     logout(): void {
       this._userName = "";
     }

     isAuth(): boolean {
       return this._userName !== "";
     }
   }
   ```

   </details><br>

1. Open the file `home.component.ts` (`src/app/home/home.component.ts`) and inject the new `AuthService`:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { Component, inject } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { LoggerService } from '../shared/logger/logger';
    import { CustomLogAppender } from '../shared/logger/custom-log-appender';
   +import { AuthService } from '../shared/auth/auth.service';

    @Component({
      selector: 'app-home',

   [...]

    })
    export class HomeComponent {
      logger = inject(LoggerService);
   +  auth = inject(AuthService);

      constructor() {
        this.logger.debug('home', 'debug');
   ```

   </details><br>

1. Switch to the file `home.component.html` (`src/app/home/home.component.html`) and add a button that logs in a hardcoded user using the `AuthService`:

   <details>
   <summary>Show Code</summary>

   ```diff
   -<h1>Welcome!</h1>
   +<h1 *ngIf="!auth.userName">Welcome!</h1>
   +<h1 *ngIf="auth.userName">Welcome {{ auth.userName }}!</h1>
   +
   +<button (click)="auth.login('Max')" class="btn btn-default">Login</button>
   +<button (click)="auth.logout()" class="btn btn-default">Logout</button>
   ```

   </details><br>

1. Open the file `flight-booking.routes.ts` (`src/app/flight-booking/flight-booking.routes.ts`) and add a `CanActivate` guard that only allows to activate the `passenger-search` route if the user has been logged in:

   <details>
   <summary>Show Code</summary>

   ```diff
   +import { inject } from '@angular/core';
    import { Routes } from '@angular/router';
   +import { AuthService } from '../shared/auth/auth.service';
    import { provideLogger } from '../shared/logger/provider';
    import { FlightBookingComponent } from './flight-booking.component';
    import { FlightEditComponent } from './flight-edit/flight-edit.component';

   [...]

          {
            path: 'passenger-search',
            component: PassengerSearchComponent,
   +        canActivate: [() => inject(AuthService).isAuth()],
          },
        ],
      },
   ```

   </details><br>

1. Test your modifications:

   ```bash
   ng serve -o
   ```

## CanActivate Guard with Redirection

Now, instead of just locking the user out, let's redirect them to the `home` route.

1. Add a file `auth.ts` (`src/app/shared/auth/auth.ts`) and implement a `CanActivate` guard as a function that redirects unauthenticated users to the `home` route:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { inject } from "@angular/core";
   import { Router, UrlTree } from "@angular/router";
   import { AuthService } from "./auth.service";

   export function checkAuth(): boolean | UrlTree {
     const auth = inject(AuthService);
     const router = inject(Router);

     if (!auth.isAuth()) {
       return router.createUrlTree(["/home", { login: true }]);
     }

     return true;
   }
   ```

   </details><br>

1. Open the file `flight-booking.routes.ts` (`src/app/flight-booking/flight-booking.routes.ts`) and use the new guard function for the `flight-edit` route:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { inject } from '@angular/core';
    import { Routes } from '@angular/router';
   -import { AuthService } from '../shared/auth/auth.service';
   +import { checkAuth } from '../shared/auth/auth';
    import { provideLogger } from '../shared/logger/provider';
    import { FlightBookingComponent } from './flight-booking.component';
    import { FlightEditComponent } from './flight-edit/flight-edit.component';

   [...]

          {
            path: 'passenger-search',
            component: PassengerSearchComponent,
   -        canActivate: [() => inject(AuthService).isAuth()],
   +        canActivate: [checkAuth],
          },
        ],
      },
   ```

   </details><br>

1. Test your modifications:

   ```bash
   ng serve -o
   ```

## Bonus: CanDeactivate Guard \*

In this lab, you write a CanDeactivate Guard that asks the user if they really want to leave the `flight-edit` route before it's deactivated.

1. Add a file `can-exit.ts` (`src/app/shared/can-exit.ts`) with the following interface:

   ```typescript
   import { Observable } from "rxjs";

   export interface CanExit {
     canExit(): Observable<boolean>;
   }
   ```

1. Open the file `flight-edit.component.ts` (`src/app/flight-booking/flight-edit/flight-edit.component.ts`) and implement the new interface. When `canExit` is called, display the `ConfirmComponent` that is already part of your project via a Angular CDK Dialog. If the user confirms the dialog, return `false`; otherwise `true`:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { AsyncCityValidatorDirective } from '../../shared/validation/async-city-
    import { RoundtripValidatorDirective } from '../../shared/validation/roundtrip-validator.directive';
    import { ActivatedRoute } from '@angular/router';
    import { FlightService } from '../flight-search/flight.service';
   +import { CanExit } from 'src/app/shared/can-exit';
   +import { Observable } from 'rxjs';
   +import { Dialog } from '@angular/cdk/dialog';
   +import { ConfirmComponent } from 'src/app/shared/confirm/confirm.component';

    @Component({
      selector: 'app-flight-edit',

   [...]

      templateUrl: './flight-edit.component.html',
      styleUrls: ['./flight-edit.component.css'],
    })
   -export class FlightEditComponent implements OnInit {
   +export class FlightEditComponent implements OnInit, CanExit {
      private route = inject(ActivatedRoute);
      private flightService = inject(FlightService);
   +  private dialog = inject(Dialog);

      id = '';
      showDetails = '';

   [...]

        });
      }

   +  canExit(): Observable<boolean> {
   +    const confirm = this.dialog.open(ConfirmComponent, {
   +      data: 'Do you really want to leave me?',
   +    });
   +    return confirm.closed as Observable<boolean>;
   +  }
   +
      load(id: string): void {
        this.flightService.findById(id).subscribe((flight) => {
          this.flight = flight;
   ```

   </details><br>

1. Switch to the file `flight-booking.routes.ts` (`src/app/flight-booking/flight-booking.routes.ts`) and add a `canDeactivate` Guard for the `flight-edit` route. This guard should delegate to the component's `canExit` method:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { Routes } from '@angular/router';
    import { checkAuth } from '../shared/auth/auth';
   +import { CanExit } from '../shared/can-exit';
    import { provideLogger } from '../shared/logger/provider';
    import { FlightBookingComponent } from './flight-booking.component';
    import { FlightEditComponent } from './flight-edit/flight-edit.component';

   [...]

          {
            path: 'flight-edit/:id',
            component: FlightEditComponent,
   +        canDeactivate: [(cmp: CanExit) => cmp.canExit()],
          },
          {
            path: 'passenger-search',
   ```

   </details><br>

1. Test your modifications:

   ```bash
   ng serve -o
   ```

## Bonus: Resolver \*

In this lab, you define a resolver for the `flight-edit` route that loads the requested `flight` object.

1. Open the file `flight-booking.routes.ts` (`src/app/flight-booking/flight-booking.routes.ts`) and add a resolver for `flight-edit` loading the requested flight via the `FlightService`:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { Routes } from '@angular/router';
   +import { inject } from '@angular/core';
   +import { ActivatedRouteSnapshot, Routes } from '@angular/router';
   +import { delay } from 'rxjs';
    import { checkAuth } from '../shared/auth/auth';
    import { CanExit } from '../shared/can-exit';
    import { provideLogger } from '../shared/logger/provider';
    import { FlightBookingComponent } from './flight-booking.component';
    import { FlightEditComponent } from './flight-edit/flight-edit.component';
    import { FlightSearchComponent } from './flight-search/flight-search.component';
   +import { FlightService } from './flight-search/flight.service';
    import { PassengerSearchComponent } from './passenger-search/passenger-search.component';

    export const FLIGHT_BOOKING_ROUTES: Routes = [

   [...]

          {
            path: 'flight-edit/:id',
            component: FlightEditComponent,
   +        resolve: {
   +          flight: (r: ActivatedRouteSnapshot) =>
   +            inject(FlightService).findById(r.params['id']).pipe(delay(3000)),
   +        },
            canDeactivate: [(cmp: CanExit) => cmp.canExit()],
          },
          {
   ```

   </details><br>

1. Switch to the file `flight-edit.component.ts` (`src/app/flight-booking/flight-edit/flight-edit.component.ts`) and receive the flight object loaded via the resolver:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { ConfirmComponent } from 'src/app/shared/confirm/confirm.component';
    })
    export class FlightEditComponent implements OnInit, CanExit {
      private route = inject(ActivatedRoute);
   -  private flightService = inject(FlightService);
      private dialog = inject(Dialog);

      id = '';

   [...]

        this.route.paramMap.subscribe((params) => {
          this.id = params.get('id') ?? '';
          this.showDetails = params.get('showDetails') ?? '';
   -      this.load(this.id);
   +    });
   +
   +    this.route.data.subscribe((data) => {
   +      this.flight = data['flight'];
        });
      }

   [...]

        });
        return confirm.closed as Observable<boolean>;
      }
   -
   -  load(id: string): void {
   -    this.flightService.findById(id).subscribe((flight) => {
   -      this.flight = flight;
   -    });
   -  }
    }
   ```

   </details><br>

   **Hint:** To demonstrate that the resolver is used indeed, you can add a `delay`.

1. Test your modifications:

   ```bash
   ng serve -o
   ```

## Bonus: Generic Loading Indicator \*

Now, let's display a generic loading indicator for route transitions.

1. Open the file `app.component.ts` (`src/app/app.component.ts`), inject the router and listen for events indicating the start and end of a route change:

   <details>
   <summary>Show Code</summary>

   ```diff
   +import { AsyncPipe, NgIf } from '@angular/common';
    import { Component, inject } from '@angular/core';
   -import { RouterOutlet } from '@angular/router';
   +import {
   +  NavigationCancel,
   +  NavigationEnd,
   +  NavigationError,
   +  NavigationStart,
   +  Router,
   +  RouterOutlet,
   +} from '@angular/router';
   +import { filter, map, merge, Observable } from 'rxjs';
    import { FlightSearchComponent } from './flight-booking/flight-search/flight-search.component';
    import { NavbarComponent } from './navbar/navbar.component';
    import { NextFlightsModule } from './next-flights/next-flights.module';

   [...]

        FlightSearchComponent,
        NextFlightsModule,
        RouterOutlet,
   +    AsyncPipe,
   +    NgIf,
      ],
      selector: 'app-root',
      templateUrl: './app.component.html',

   [...]

    })
    export class AppComponent {
      title = 'Hello World!';
   -
      configService = inject(ConfigService);
   +  router = inject(Router);
   +  loading$: Observable<boolean>;

      constructor() {
        // TODO: In a later lab, we will assure that
        //  loading did happen _before_ we use the config!
        this.configService.loadConfig();
   +
   +    const stop$ = this.router.events.pipe(
   +      filter(
   +        (e) =>
   +          e instanceof NavigationEnd ||
   +          e instanceof NavigationError ||
   +          e instanceof NavigationCancel
   +      ),
   +      map(() => false)
   +    );
   +
   +    const start$ = this.router.events.pipe(
   +      filter((e) => e instanceof NavigationStart),
   +      map(() => true)
   +    );
   +
   +    this.loading$ = merge(start$, stop$);
      }
    }
   ```

   </details><br>

1. Switch to the file `app.component.css` (`src/app/app.component.css`) and add the following CSS for an animated loading indicator:

   ```diff
   +.loading-indicator {
   +  position: fixed;
   +  left: 0px;
   +  top: 0px;
   +  width: 100%;
   +  height: 100%;
   +  background-color: black;
   +  opacity: 0.3;
   +  z-index: 1000;
   +}
   +
   +.spinner {
   +  width: 40px;
   +  height: 40px;
   +
   +  position: relative;
   +  margin: 100px auto;
   +}
   +
   +.double-bounce1,
   +.double-bounce2 {
   +  width: 100%;
   +  height: 100%;
   +  border-radius: 50%;
   +  background-color: #fff;
   +  opacity: 0.6;
   +  position: absolute;
   +  top: 0;
   +  left: 0;
   +
   +  -webkit-animation: sk-bounce 2s infinite ease-in-out;
   +  animation: sk-bounce 2s infinite ease-in-out;
   +}
   +
   +.double-bounce2 {
   +  -webkit-animation-delay: -1s;
   +  animation-delay: -1s;
   +}
   +
   +@-webkit-keyframes sk-bounce {
   +  0%,
   +  100% {
   +    -webkit-transform: scale(0);
   +  }
   +  50% {
   +    -webkit-transform: scale(1);
   +  }
   +}
   +
   +@keyframes sk-bounce {
   +  0%,
   +  100% {
   +    transform: scale(0);
   +    -webkit-transform: scale(0);
   +  }
   +  50% {
   +    transform: scale(1);
   +    -webkit-transform: scale(1);
   +  }
   +}
   ```

1. Open the file `app.component.html` (`src/app/app.component.html`) and display the following HTML fragment during route transitions:

   ```diff
    <router-outlet name="aux"></router-outlet>
      </div>
    </div>
   +
   +<div *ngIf="loading$ | async" class="loading-indicator">
   +  <div class="spinner">
   +    <div class="double-bounce1"></div>
   +    <div class="double-bounce2"></div>
   +  </div>
   +</div>
   ```

1. Test your modifications:

   ```bash
   ng serve -o
   ```
