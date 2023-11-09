# Change Detection: Deep Dive

[[TOC]]

For this lab, checkout the branch `lab303-data-binding-starter`:

```
git add *
git stash
git checkout lab303-data-binding-starter
```

## Using Immutables with OnPush

In this lab, you try out OnPush with Immutables.

1. Open the file `flight-card.component.html` (`src/app/flight-booking/flight-card/flight-card.component.html`) and data bind the `blink` method:

   <details>
   <summary>Show Code</summary>

   ```diff
    <ng-content select=".bottom"></ng-content>
      </div>
    </div>
   +
   +{{ blink() }}
   ```

   </details><br>

1. Start your project and search for some flights. After clicking on delay, all components should be checked for changes.

1. Open the file `default-flight.service.ts` (`src/app/flight-booking/flight-search/default-flight.service.ts`) and make sure `update` creates new object references:

   <details>
   <summary>Show Code</summary>

   ```diff
    export class DefaultFlightService implements FlightService {
        const oldFlight = oldFlights[0];
        const oldDate = new Date(oldFlight.date);

   -    oldDate.setTime(oldDate.getTime() + 15 * ONE_MINUTE);
   -    oldFlight.date = oldDate.toISOString();
   +    // Mutable
   +    // oldDate.setTime(oldDate.getTime() + 15 * ONE_MINUTE );
   +    // oldFlight.date = oldDate.toISOString();
   +
   +    // Immutable
   +    const newDate = new Date(oldDate.getTime() + 15 * ONE_MINUTE);
   +    const newFlight: Flight = { ...oldFlight, date: newDate.toISOString() };
   +    const newFlights = [newFlight, ...oldFlights.slice(1)];
   +    this.flights = newFlights;
      }
    }
   ```

   </details><br>

1. Switch to the file `flight-card.component.ts` (`src/app/flight-booking/flight-card/flight-card.component.ts`) and activate `OnPush`:

   <details>
   <summary>Show Code</summary>

   ```diff
    import {
   +  ChangeDetectionStrategy,
      Component,
      ElementRef,
      EventEmitter,

   [...]

      imports: [CommonModule, CityPipe, StatusToggleComponent, RouterLink],
      templateUrl: './flight-card.component.html',
      styleUrls: ['./flight-card.component.css'],
   +  changeDetection: ChangeDetectionStrategy.OnPush,
    })
    export class FlightCardComponent {
      private dialog = inject(MatDialog);
   ```

   </details><br>

1. Start your project and search for some flights. Click on delay. Now, only the affected component is checked for changes.

## Using Observables with OnPush

Now, let's also use Observables with `OnPush`.

1. Open the file `flight.service.ts` (`src/app/flight-booking/flight-search/flight.service.ts`) and provide a `flights$` Observable:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { DefaultFlightService } from './default-flight.service';
      useClass: DefaultFlightService,
    })
    export abstract class FlightService {
   +  abstract readonly flights$: Observable<Flight[]>;
      abstract flights: Flight[];
   +
      abstract find(from: string, to: string): Observable<Flight[]>;
      abstract findById(id: string): Observable<Flight>;
      abstract delay(): void;
   ```

   </details><br>

1. Switch to the file `default-flight.service.ts` (`src/app/flight-booking/flight-search/default-flight.service.ts`) and implement the newly introduced `flights$` Observable:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { HttpClient } from '@angular/common/http';
    import { inject, Injectable } from '@angular/core';
   -import { Observable } from 'rxjs';
   +import { BehaviorSubject, Observable } from 'rxjs';
    import { Flight } from '../../model/flight';
    import { ConfigService } from '../../shared/config.service';
    import { FlightService } from './flight.service';

   [...]

      private http = inject(HttpClient);
      private configService = inject(ConfigService);

   +  private flightsSubject = new BehaviorSubject<Flight[]>([]);
   +  readonly flights$ = this.flightsSubject.asObservable();
   +
      flights: Flight[] = [];

      find(from: string, to: string): Observable<Flight[]> {

   [...]

      load(from: string, to: string): void {
        this.find(from, to).subscribe((flights) => {
          this.flights = flights;
   +      this.flightsSubject.next(flights);
        });
      }

   [...]

        const newFlight: Flight = { ...oldFlight, date: newDate.toISOString() };
        const newFlights = [newFlight, ...oldFlights.slice(1)];
        this.flights = newFlights;
   +
   +    this.flightsSubject.next(newFlights);
      }
    }
   ```

   </details><br>

1. Also in `dummy-flight.service.ts` (`src/app/flight-booking/flight-search/dummy-flight.service.ts`), implement the new `flights$` property:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { FlightService } from './flight.service';

    @Injectable()
    export class DummyFlightService implements FlightService {
   +  flights$: Observable<Flight[]> = of([]);
      flights: Flight[] = [];

      load(from: string, to: string): void {
        this.find(from, to).subscribe((flights) => {
          this.flights = flights;
   +      this.flights$ = of(this.flights);
        });
      }
   ```

   </details><br>

1. Adjust the file `flight-search.component.ts` (`src/app/flight-booking/flight-search/flight-search.component.ts`) so that it uses `flights$`. Also, switch to `OnPush`:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { Component, inject } from '@angular/core';
   +import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { Flight } from '../../model/flight';
    import { FormsModule } from '@angular/forms';

   [...]

      templateUrl: './flight-search.component.html',
      styleUrls: ['./flight-search.component.css'],
      imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
   +  changeDetection: ChangeDetectionStrategy.OnPush,
    })
    export class FlightSearchComponent {
      from = 'London';

   [...]


      private flightService = inject(FlightService);

   -  get flights(): Flight[] {
   -    return this.flightService.flights;
   -  }
   +  flights$ = this.flightService.flights$;

      search(): void {
        // Reset properties
   ```

   </details><br>

1. Open the file `flight-search.component.html` (`src/app/flight-booking/flight-search/flight-search.component.html`) and use `flights$`:

   <details>
   <summary>Show Code</summary>

   ```diff
    </form>

    <div class="row">
   -  <div *ngFor="let f of flights" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
   +  <div
   +    *ngFor="let f of flights$ | async"
   +    class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
   +  >
        <app-flight-card [item]="f" [(selected)]="basket[f.id]">
          <p class="middle"><i>Delays are possible!</i></p>
          <p class="bottom"><small>Statement without guarantee!</small></p>
   ```

   </details><br>

1. Start your project. The behavior should be the same as before.
