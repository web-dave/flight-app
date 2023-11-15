import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  withDebugTracing,
  withPreloading,
} from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { withColor } from './app/shared/logger/color';
import { provideLogger } from './app/shared/logger/provider';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(
      APP_ROUTES,
      withPreloading(PreloadAllModules)
      // withDebugTracing()
    ),

    importProvidersFrom(MatDialogModule),

    provideLogger({}, withColor()),
  ],
});
