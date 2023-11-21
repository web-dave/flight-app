import { provideHttpClient } from '@angular/common/http';
import { InjectionToken, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()],
});

export const meinTocken = new InjectionToken('BAR', {
  providedIn: 'root',
  factory: () => 'FOBARBAZ',
});
