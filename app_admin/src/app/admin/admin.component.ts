import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DecimalPipe, DatePipe, SlicePipe } from '@angular/common';
import { TripDataService } from '../services/trip-data.service';

type Trip = {
  _id?: string;
  code: string;
  name: string;
  length: number | string;
  start: string | Date;
  resort: string;
  perPerson: number | string;
  image: string;
  description: string;
};

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe, DatePipe, SlicePipe],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  trips: Trip[] = [];
  loading = true;
  error = '';

  // add form feedback flags you already used
  addError = '';
  addSuccess = false;

  async ngOnInit() {
    await this.loadTrips();
  }

  private async loadTrips() {
    this.loading = true;
    this.error = '';

    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('http://localhost:3000/api/trips', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || res.statusText);

      // API returns an array
      this.trips = Array.isArray(data) ? data : (data.trips || []);
    } catch (e: any) {
      this.error = e?.message || 'Failed to load trips';
    } finally {
      this.loading = false;
    }
  }

  // your existing handler, just append the refresh + reset
  async onAddSubmit(e: Event) {
    e.preventDefault();
    this.addError = '';
    this.addSuccess = false;

    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);

    const payload = {
      code:        String(fd.get('code') || '').trim(),
      name:        String(fd.get('name') || '').trim(),
      resort:      String(fd.get('resort') || '').trim(),
      length:      Number(fd.get('length') || 0),
      start:       new Date(String(fd.get('start') || '')).toISOString(),
      perPerson:   Number(fd.get('perPerson') || 0),
      image:       String(fd.get('image') || '').trim(),
      description: String(fd.get('description') || '').trim(),
    };

    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('http://localhost:3000/api/trips', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || res.statusText);

      // success — show message, clear form, and reload the grid
      this.addSuccess = true;
      form.reset();
      await this.loadTrips();
    } catch (err: any) {
      this.addError = err?.message || 'Failed to add trip';
    }
  }

  onEdit(t: Trip) { alert(`Edit ${t.code}`); }
  onDelete(t: Trip) { alert(`Delete ${t.code}`); }
}