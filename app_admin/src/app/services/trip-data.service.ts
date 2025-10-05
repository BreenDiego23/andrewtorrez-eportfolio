import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Trip } from '../models/trips';
import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class TripDataService {
  private apiUrl = 'http://localhost:3000/api/trips';
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('travlr-token') || ''}`,
      'Content-Type': 'application/json'
    });
  }

  getTrips(): Promise<Trip[]> {
    return firstValueFrom(
      this.http.get<Trip[]>(this.apiUrl, { headers: this.authHeaders() })
    );
  }

  // Many Travlr backends return an array for a single code
  getTrip(tripCode: string): Promise<Trip[]> {
    return firstValueFrom(
      this.http.get<Trip[]>(
        `${this.apiUrl}/${encodeURIComponent(tripCode)}`,
        { headers: this.authHeaders() }
      )
    );
  }

  addTrip(formData: Trip): Promise<Trip> {
    return firstValueFrom(
      this.http.post<Trip>(this.apiUrl, formData, { headers: this.authHeaders() })
    );
  }

  updateTrip(formData: Trip): Promise<Trip> {
    return firstValueFrom(
      this.http.put<Trip>(
        `${this.apiUrl}/${encodeURIComponent(formData.code)}`,
        formData,
        { headers: this.authHeaders() }
      )
    );
  }

  deleteTrip(code: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(
        `${this.apiUrl}/${encodeURIComponent(code)}`,
        { headers: this.authHeaders() }
      )
    );
  }
  deleteTripById(id: string): Promise<void> {
  // adjust path if your API uses a different one (e.g. /api/trips/id/:id)
  return firstValueFrom(
    this.http.delete<void>(
      `${this.apiUrl}/id/${encodeURIComponent(id)}`,
      { headers: this.authHeaders() }
    )
  );
}

  // ---- Auth endpoints (Promise-based) ----
  login(email: string, password: string): Promise<AuthResponse> {
    return firstValueFrom(
      this.http.post<AuthResponse>(
        `${this.baseUrl}/login`,
        { email, password },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      )
    );
  }
  
  register(user: User, password: string): Promise<AuthResponse> {
    const body = { ...user, password }; // typically { email, name, password }
    return firstValueFrom(
      this.http.post<AuthResponse>(
        `${this.baseUrl}/register`,
        body,
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      )
    );
  }
}