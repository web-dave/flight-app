import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Flight } from '../../model/flight';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { validateCity } from '../../shared/validation/city-validator';
import { FlightService } from '../flight-search/flight.service';
import { validateAsyncCity } from '../../shared/validation/async-city-validator';
import { ValidationErrorsComponent } from '../../shared/validation-errors/validation-errors.component';
import { validateRoundTrip } from '../../shared/validation/roundtrip-validator';
import { NEVER, Observable, from, map } from 'rxjs';

@Component({
  selector: 'app-flight-edit-reactive',
  standalone: true,
  templateUrl: './flight-edit-reactive.component.html',
  styleUrls: ['./flight-edit-reactive.component.css'],
  imports: [CommonModule, ReactiveFormsModule, ValidationErrorsComponent],
})
export class FlightEditReactiveComponent {
  private flightService = inject(FlightService);

  private dialogRef = inject(MatDialogRef);
  private data = inject<{ flight: Flight }>(MAT_DIALOG_DATA);
  flight = this.data.flight;

  private fb = inject(FormBuilder);

  form: FormGroup;

  fromValidation: Observable<boolean> = NEVER;

  constructor() {
    this.form = this.fb.nonNullable.group({
      id: [0],
      from: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          validateCity(['London', 'Paris', 'Berlin']),
        ],
        [validateAsyncCity(this.flightService)],
      ],
      to: [''],
      date: [''],
      delayed: [false],
    });
    this.form.addValidators(validateRoundTrip);

    this.form.patchValue(this.flight);

    this.form.valueChanges.subscribe((flightForm: { [key: string]: any }) => {
      console.log('flight form changed:', flightForm);
    });

    this.form.controls['from'].valueChanges.subscribe((from: string) => {
      console.log('from changed:', from);
    });
    this.fromValidation = this.form.controls['from'].statusChanges.pipe(
      map((status) => status === 'PENDING')
    );
  }

  save(): void {
    this.flight = this.form.getRawValue();
    console.log('flight', this.flight);
  }

  close(): void {
    this.dialogRef.close();
  }
}
