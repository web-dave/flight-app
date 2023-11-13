import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../model/flight';
import { FormsModule } from '@angular/forms';
import { FlightService } from './flight.service';
import { CityPipe } from '../../shared/city.pipe';
import { FlightCardComponent } from '../flight-card/flight-card.component';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
})
export class FlightSearchComponent {
  from = 'London';
  to = 'Paris';
  // flights: Array<Flight> = [];
  selectedFlight: Flight | undefined;
  message = '';

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };
  get flights(): Flight[] {
    return this.flightService.flights;
  }

  private flightService = inject(FlightService);
  delay(): void {
    this.flightService.delay();
  }
  search(): void {
    // Reset properties
    this.message = '';
    this.selectedFlight = undefined;
  }

  select(f: Flight): void {
    this.selectedFlight = { ...f };
  }
}
