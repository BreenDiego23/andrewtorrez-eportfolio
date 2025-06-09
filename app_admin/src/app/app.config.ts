import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core'; // ✅ Required for standalone providers
import { HttpClientModule } from '@angular/common/http'; // ✅ Enables HTTP requests

import { routes } from './app.routes';
import { TripListingComponent } from './trip-listing/trip-listing.component'; // Already there

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule) // ✅ Add this line
  ]
};
