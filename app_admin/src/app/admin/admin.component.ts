import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DecimalPipe, DatePipe, SlicePipe } from '@angular/common';

type Trip = {
  _id: string;
  code: string;
  name: string;
  length: string;
  start: Date;
  resort: string;
  perPerson: string;
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

  async ngOnInit() {
    this.loading = true;
    this.error = '';

    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('http://localhost:3000/api/trips', {
        headers: { 'Authorization': 'Bearer ' + token }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || res.statusText);

      this.trips = Array.isArray(data) ? data : (data.trips || []);
    } catch (e: any) {
      this.error = e?.message || 'Failed to load trips';
    } finally {
      this.loading = false;
    }
  }

  // 👇 Move these inside the class
  onEdit(t: Trip) {
    alert(`Edit ${t.code}`);
  }

  onDelete(t: Trip) {
    alert(`Delete ${t.code}`);
  }
}