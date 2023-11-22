import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Flight } from '../model/flight';
import { FormsModule } from '@angular/forms';
import { FlightService } from './flight.service';
import { CityPipe } from '../shared/city.pipe';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { NEVER, Observable } from 'rxjs';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent {
  from = 'Hamburg';
  to = 'Paris';
  // flights: Array<Flight> = [];
  flights$: Observable<Flight[]> = NEVER;
  selectedFlight: Flight | undefined;

  selected = false;
  show = true;
  private flightService = inject(FlightService);

  search(): void {
    console.log('Hallo');

    // Reset properties
    this.selectedFlight = undefined;

    this.flights$ = this.flightService.find(this.from, this.to);
    // .subscribe({
    //   next: (flights) => {
    //     this.flights = flights;
    //   },
    //   error: (errResp) => {
    //     console.error('Error loading flights', errResp);
    //   },
    // });
  }

  select(f: Flight): void {
    this.selectedFlight = f;
  }
}
