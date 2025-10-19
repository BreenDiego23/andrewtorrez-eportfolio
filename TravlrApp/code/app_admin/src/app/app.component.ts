import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Travlr Getaways Admin!';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Grab ?token= from the URL if present (coming from the 3000 header link)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);

      // Clean the URL (remove ?token=…)
      history.replaceState({}, '', window.location.pathname);

      // Send user to your admin landing route
      this.router.navigateByUrl('/admin');
    }
  }
}