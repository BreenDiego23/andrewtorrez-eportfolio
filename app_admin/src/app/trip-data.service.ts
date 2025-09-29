import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Trip } from './models/trips';  
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiUrl = 'http://localhost:3000/api/trips';

  constructor(private http: HttpClient) {}

  // Get all trips
  public getTrips(): Promise<Trip[]> {
    return firstValueFrom(this.http.get<Trip[]>(this.apiUrl));
  }

  // Get a single trip
  public getTrip(tripCode: string): Promise<Trip> {
    return firstValueFrom(this.http.get<Trip>(`${this.apiUrl}/${tripCode}`));
  }

  // Add a new trip
  public addTrip(formData: Trip): Promise<Trip> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('travlr-token')}`
      })
    };
    return firstValueFrom(this.http.post<Trip>(this.apiUrl, formData, httpOptions));
  }

  // Update an existing trip
  public updateTrip(formData: Trip): Promise<Trip> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('travlr-token')}`
      })
    };
    return firstValueFrom(this.http.put<Trip>(`${this.apiUrl}/${formData.code}`, formData, httpOptions));
  }
}