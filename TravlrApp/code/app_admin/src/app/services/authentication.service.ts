import { Credentials } from '../models/credentials';
import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from '../services/trip-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) { }

  authResp: AuthResponse = new AuthResponse();

  public getToken(): string {
    const out = this.storage.getItem('travlr-token');
    return out || '';
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  public login(email: string, password: string): Promise<void> {
    return this.tripDataService.login(email, password)
      .then((authResp: AuthResponse) => {
        if (authResp && authResp.token) {
          this.authResp = authResp;
          this.saveToken(authResp.token);
        }
      })
      .catch((error: any) => {
        console.error('Login error:', error);
        throw error;
      });
  }

  public register(credentials: Credentials): Promise<void> {
    return this.tripDataService.register(
      { email: credentials.email, name: credentials.name },
      credentials.password
    )
      .then((authResp: AuthResponse) => {
        if (authResp && authResp.token) {
          this.authResp = authResp;
          this.saveToken(authResp.token);
        }
      })
      .catch((error: any) => {
        console.error('Register error:', error);
        throw error;
      });
  }
}
