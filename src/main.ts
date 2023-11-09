import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { NextFlightsModule } from './app/next-flights/next-flights.module';
import { LoggerService } from './app/shared/logger/logger';
import { LoggerConfig } from './app/shared/logger/logger-config';
import { LogLevel } from './app/shared/logger/log-level';
import {
  DefaultLogFormatter,
  LogFormatter,
} from './app/shared/logger/log-formatter';
import { CustomLogFormatter } from './app/shared/logger/custom-log-formatter';
import {
  CustomLogAppender,
  DefaultLogAppender,
  LOG_APPENDERS,
} from './app/shared/logger/log-appender';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    importProvidersFrom(NextFlightsModule),
    importProvidersFrom(MatDialogModule),
    LoggerService,
    {
      provide: LOG_APPENDERS,
      useClass: DefaultLogAppender,
      multi: true,
    },
    CustomLogAppender,
    {
      provide: LOG_APPENDERS,
      useClass: CustomLogAppender,
      multi: true,
    },
    {
      provide: LoggerConfig,
      useValue: {
        level: LogLevel.INFO,
      },
    },
    {
      provide: LogFormatter,
      useClass: CustomLogFormatter,
    },
  ],
});
