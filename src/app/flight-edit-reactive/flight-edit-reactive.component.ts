import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Flight } from '../model/flight';
import {
  asyncCityValidator,
  cityValidator,
  validateRoundTrip,
} from './city.validator';

@Component({
  selector: 'app-flight-edit-reactive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flight-edit-reactive.component.html',
  styleUrls: ['./flight-edit-reactive.component.css'],
})
export class FlightEditReactiveComponent {
  private dialogRef = inject(MatDialogRef);
  cities = ['Berlin', 'Hamburg', 'Paris', 'Graz'];

  private data = inject<{ flight: Flight }>(MAT_DIALOG_DATA);
  flight = this.data.flight;

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    id: [0],
    from: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        cityValidator(this.cities),
      ],
    ],
    to: ['', [], [asyncCityValidator()]],
    date: [''],
    delayed: [false],
  });

  constructor() {
    this.form.patchValue(this.flight);
    this.form.addValidators(validateRoundTrip);
    this.form.statusChanges
      .pipe(takeUntilDestroyed())
      .subscribe((flightForm) => {
        console.log('flight form changed:', flightForm);
      });

    this.form.controls.from.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((from) => {
        console.log('from changed:', from);
      });
  }

  save(): void {
    this.flight = this.form.getRawValue();
    console.log('flight', this.flight);
  }

  close(): void {
    this.dialogRef.close();
  }
}
