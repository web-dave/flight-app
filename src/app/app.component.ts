import { Component, OnInit, inject } from '@angular/core';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FlightSearchService } from './service/flight-search.service';
import { meinTocken } from 'src/main';

@Component({
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, FlightSearchComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Hello World!';
  servise = inject(FlightSearchService);
  derTocken = inject(meinTocken);
}
