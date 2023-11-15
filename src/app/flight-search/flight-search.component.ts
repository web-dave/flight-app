import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../model/flight';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FlightService } from './flight.service';
import { CityPipe } from '../shared/city.pipe';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { HttpClient } from '@angular/common/http';
import { concatMap, exhaustMap, mergeMap, switchMap } from 'rxjs';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CityPipe,
    FlightCardComponent,
  ],
})
export class FlightSearchComponent {
  http = inject(HttpClient);

  suche(begriff: string) {
    //quelle
    this.http.get('https://swapi.dev/api/people?q=' + begriff).subscribe();
  }
  constructor() {
    //trigger
    this.form.controls['from'].valueChanges
      .pipe(
        // skipp bei neuen suchbegriff
        // switchMap((data) =>

        // skip bis antwort, erst dann werden neue suchen gestartet
        // exhaustMap((data) =>

        // alle begriffe sofort
        // mergeMap((data) =>

        // queue alle abfragen
        concatMap((data) =>
          this.http.get('https://swapi.dev/api/people?q=' + data)
        )
      )
      .subscribe();
  }
  from = 'Hamburg';
  to = 'Paris';
  flights: Array<Flight> = [];
  selectedFlight: Flight | undefined;
  message = '';

  isUppercase: ValidatorFn = (
    ctrl: AbstractControl
  ): ValidationErrors | null => {
    const check = String(ctrl.value).toUpperCase();
    return ctrl.value === check ? { uppcase: 'Nix gut!' } : null;
  };

  form: FormGroup = new FormGroup({
    from: new FormControl('Hamburg', [Validators.required, this.isUppercase]),
    to: new FormControl('Düsseldorf'),
  });

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  private flightService = inject(FlightService);

  search(): void {
    // Reset properties
    this.message = '';
    this.selectedFlight = undefined;

    this.flightService.find(this.from, this.to).subscribe({
      next: (flights) => {
        this.flights = flights;
      },
      error: (errResp) => {
        console.error('Error loading flights', errResp);
      },
    });
  }

  select(f: Flight): void {
    this.selectedFlight = { ...f };
  }
}
