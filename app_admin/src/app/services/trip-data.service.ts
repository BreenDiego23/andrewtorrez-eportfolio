import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiUrl = 'http://localhost:3000/api/trips';

  constructor(private http: HttpClient) {}

  // Get all trips
  public getTrips(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get a single trip
  public getTrip(tripCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${tripCode}`);
  }
}
