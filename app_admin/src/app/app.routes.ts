import { Routes } from '@angular/router';
import { AddTripComponent } from './add-trip/add-trip.component';
import { TripListingComponent } from './trip-listing/trip-listing.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { LoginComponent } from './login/login.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { NewsComponent } from './news/news.component';
import { AdminComponent } from './admin/admin.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin' },

  { path: 'login', component: LoginComponent },

  // TEMP: remove canActivate to unblock UI
  { path: 'admin', component: AdminComponent }, // , canActivate: [AuthGuard]
  { path: 'add-trip', component: AddTripComponent }, // , canActivate: [AuthGuard]
  { path: 'edit-trip', component: EditTripComponent }, // , canActivate: [AuthGuard]
  { path: 'reservations', component: ReservationsComponent }, // , canActivate: [AuthGuard]
  { path: 'checkout', component: CheckoutComponent }, // , canActivate: [AuthGuard]

  { path: 'trips', component: TripListingComponent },
  { path: 'news', component: NewsComponent },

  { path: '**', redirectTo: 'admin' }
];