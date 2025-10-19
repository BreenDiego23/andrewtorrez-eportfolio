import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {
  public addForm!: FormGroup;
  public submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) {}

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (this.addForm.invalid) return;

    // include disabled controls if any
    const raw = this.addForm.getRawValue ? this.addForm.getRawValue() : this.addForm.value;

    // normalize number fields and date
    const payload = {
      ...raw,
      length: Number(raw.length),
      perPerson: Number(raw.perPerson),
      start: new Date(String(raw.start)).toISOString()
    };

    try {
      await this.tripService.addTrip(payload); // TripDataService returns a Promise
      this.addForm.reset();
      this.router.navigate(['/admin']); // go back to admin grid
    } catch (error) {
      console.error('Error:', error);
    }
  }

  get f() {
    return this.addForm.controls;
  }
}