import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trips'

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiUrl = 'http://localhost:3000/api/trips';

  constructor(private http: HttpClient) {}

  // Get all trips
  public getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  // Get a single trip
  public getTrip(tripCode: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${tripCode}`);
  }

  // Add a new trip
  public addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, formData);
  }

  // Update an existing trip
  public updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/${formData.code}`, formData);
  }
}