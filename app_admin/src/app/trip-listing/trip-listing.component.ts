import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../models/trips';
import { TripCardComponent } from '../trip-card/trip-card.component';
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';
import { RouterModule } from '@angular/router';

import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, RouterModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrls: ['./trip-listing.component.css'],
  providers: [TripDataService]
})
export class TripListingComponent implements OnInit {
  trips: Trip[] = [];
  message: string = '';

  constructor(
    private tripDataService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    console.log('trip-listing constructor');
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  private async getStuff(): Promise<void> {
    try {
      const value: Trip[] = await this.tripDataService.getTrips();
      this.trips = value;
      if (value.length > 0) {
        this.message = `There are ${value.length} trips available.`;
      } else {
        this.message = 'There were no trips retrieved from the database';
      }
      console.log(this.message);
    } catch (err: any) {
      console.log('Error:', err);
    }
  }

  async ngOnInit(): Promise<void> {
    console.log('ngOnInit');
    await this.getStuff();
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}