import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../shared/logger/logger';
import {
  CustomLogAppender,
  LOG_APPENDERS,
  LogAppender,
} from '../shared/logger/log-appender';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  logger = inject(LoggerService);
  appenders = inject(LOG_APPENDERS);
  constructor() {
    this.logger.debug('Home', 'A Debug Msg');
    this.logger.info('Home', 'A Info Msg');
    this.logger.error('Home', 'A Error Msg');
    this.appenders.forEach((a) => console.log(a));
  }
}
