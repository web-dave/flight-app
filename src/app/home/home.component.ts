import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../shared/logger/logger';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  logger = inject(LoggerService);
  constructor() {
    this.logger.debug('Home', 'A Debug Msg');
    this.logger.info('Home', 'A Info Msg');
    this.logger.error('Home', 'A Error Msg');
  }
}
