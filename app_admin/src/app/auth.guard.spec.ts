import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

// If AuthenticationService is at src/app/services/authentication.service.ts:
import { AuthenticationService } from './services/authentication.service';
// If it's at src/app/authentication.service.ts, use:
// import { AuthenticationService } from './authentication.service';

// If TripDataService is at src/app/trip-data.service.ts:
import { TripDataService } from './trip-data.service';
// If it’s at src/app/services/trip-data.service.ts, use:
// import { TripDataService } from './services/trip-data.service';

// Storage token
import { BROWSER_STORAGE } from './storage'; // adjust if yours lives elsewhere

describe('AuthGuard (class)', () => {
  let guard: AuthGuard;

  // tiny stubs
  const routerStub = { navigate: jasmine.createSpy('navigate') } as Partial<Router>;
  const tripDataStub = {
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
  } as Partial<TripDataService>;

  // we’ll flip this in tests
  let loggedIn = true;
  const authStub: Partial<AuthenticationService> = {
    isLoggedIn: () => loggedIn,
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerStub },
        { provide: AuthenticationService, useValue: authStub },
        { provide: TripDataService, useValue: tripDataStub },
        { provide: BROWSER_STORAGE, useValue: window.localStorage }, // or a simple mock object
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('allows activation when logged in', () => {
    loggedIn = true;
    const ok = guard.canActivate();   // your guard takes 0 args
    expect(ok).toBeTrue();            // if you return UrlTree on success, adjust assertion
  });

  it('blocks activation when NOT logged in', () => {
    loggedIn = false;
    const ok = guard.canActivate();
    expect(ok).toBeFalse();           // if your guard returns a UrlTree, assert that instead
  });
});