import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { NextFlightsModule } from './app/next-flights/next-flights.module';
import {
  provideRouter,
  withDebugTracing,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { APP_ROUTES } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(NextFlightsModule),
    importProvidersFrom(MatDialogModule),
    provideRouter(
      APP_ROUTES,
      withDebugTracing(),
      withPreloading(PreloadAllModules)
    ),
  ],
});
