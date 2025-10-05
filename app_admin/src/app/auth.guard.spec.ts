import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

// Services
import { AuthenticationService } from './services/authentication.service';
import { TripDataService } from './services/trip-data.service';

// Models (so our stubs return the correct types)
import { AuthResponse } from './models/auth-response';

// Storage token
import { BROWSER_STORAGE } from './storage';

describe('AuthGuard (class)', () => {
  let guard: AuthGuard;

  // Tiny stubs
  const routerStub = { navigate: jasmine.createSpy('navigate') } as Partial<Router>;

  // Return Promise<AuthResponse>, not Promise<void>
  const tripDataStub: Partial<TripDataService> = {
    login: () => Promise.resolve({ token: 'test-token' } as AuthResponse),
    register: () => Promise.resolve({ token: 'test-token' } as AuthResponse),
  };

  // We’ll flip this in tests
  let loggedIn = true;
  const authStub: Partial<AuthenticationService> = {
    isLoggedIn: () => loggedIn,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerStub },
        { provide: AuthenticationService, useValue: authStub },
        { provide: TripDataService, useValue: tripDataStub },
        { provide: BROWSER_STORAGE, useValue: window.localStorage }, // or a simple in-memory mock
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('allows activation when logged in', () => {
    loggedIn = true;
    const ok = guard.canActivate(); // your guard takes 0 args
    expect(ok).toBeTrue();
  });

  it('blocks activation when NOT logged in', () => {
    loggedIn = false;
    const ok = guard.canActivate();
    expect(ok).toBeFalse();
  });
});