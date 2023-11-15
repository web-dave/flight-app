import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../shared/logger/logger';
import { CustomLogAppender } from '../shared/logger/custom-log-appender';
import { AuthService, AuthService2 } from '../shared/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  logger = inject(LoggerService);
  auth = inject(AuthService);
  auth2 = inject(AuthService2);

  welcomeMsg() {
    console.log('welcome!');

    return this.auth.isLoggedin() ? ` ${this.auth.userName}` : ``;
  }

  constructor() {
    this.logger.debug('home', 'debug');
    this.logger.info('home', 'info');
    this.logger.error('home', 'error');
  }
}
