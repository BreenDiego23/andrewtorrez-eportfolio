import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trips';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css'] // <-- plural
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  async ngOnInit(): Promise<void> {
    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    // Build the form
    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });

    // Make code read-only in the form (important!)
    this.editForm.get('code')?.disable();

    try {
      const value = await this.tripDataService.getTrip(tripCode); // Promise
      const trip: Trip | undefined = Array.isArray(value) ? value[0] : value;

      if (!trip) {
        this.message = 'No Trip Retrieved!';
        return;
      }

      // Keep original trip (especially the true code)
      this.trip = trip;

      // Patch the form; convert start to yyyy-MM-dd for the date input
      const formattedStart = this.formatDateForInput(trip.start as any);
      this.editForm.patchValue({ ...trip, start: formattedStart });

      this.message = `Trip: ${tripCode} retrieved`;
      console.log(this.message);
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (!this.editForm.valid) return;

    try {
      // Include disabled controls (like 'code')
      const raw = this.editForm.getRawValue();

      const payload: Trip = {
        ...this.trip,            // keep original immutable fields
        ...raw,                  // user edits
        code: this.trip.code,    // lock the true code for URL (prevents /trips/nope)
        length: Number(raw.length),
        perPerson: Number(raw.perPerson),
        start: new Date(raw.start as any).toISOString() as any, // backend expects ISO
      };

      await this.tripDataService.updateTrip(payload); // Promise-based
      this.router.navigate(['/admin']);
    } catch (error) {
      console.error('Error: ', error);
      alert('Failed to update trip');
    }
  }

  get f() {
    return this.editForm.controls;
  }

  private formatDateForInput(dateValue: string | Date): string {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = ('0' + (d.getMonth() + 1)).slice(-2);
    const da = ('0' + d.getDate()).slice(-2);
    return `${y}-${m}-${da}`;
  }
}