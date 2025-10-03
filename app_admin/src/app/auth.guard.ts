import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');

    // Require a valid token AND admin role
    if (token && role === 'admin') {
      return true;
    }

    // Not logged in as admin → send them to the server-side login on :3000
    window.location.href = 'http://localhost:3000/login';
    return false;
  }
}