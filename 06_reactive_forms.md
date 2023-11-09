# Reactive Forms

[[TOC]]

For this lab, checkout the branch `lab07-reactive-starter`:

```
git add *
git stash
git checkout lab07-reactive-starter
```

## Using Typed Reactive Forms

Let's add a `FlightEditReactiveComponent` for editing flights using reactive forms.

1. Execute the following command:

   ```bash
   ng g component flight-edit-reactive --standalone
   ```

1. Update the generated file `flight-edit-reactive.component.ts` (`src/app/flight-edit-reactive/flight-edit-reactive.component.ts`):

   ```typescript
   import { Component, inject } from "@angular/core";
   import { CommonModule } from "@angular/common";
   import {
     FormBuilder,
     ReactiveFormsModule,
     Validators,
   } from "@angular/forms";
   import { Flight } from "../model/flight";
   import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

   @Component({
     selector: "app-flight-edit-reactive",
     standalone: true,
     imports: [CommonModule, ReactiveFormsModule],
     templateUrl: "./flight-edit-reactive.component.html",
     styleUrls: ["./flight-edit-reactive.component.css"],
   })
   export class FlightEditReactiveComponent {
     private dialogRef = inject(MatDialogRef);

     private data = inject<{ flight: Flight }>(MAT_DIALOG_DATA);
     flight = this.data.flight;

     private fb = inject(FormBuilder);

     form = this.fb.nonNullable.group({
       id: [0],
       from: ["", [Validators.required, Validators.minLength(3)]],
       to: [""],
       date: [""],
       delayed: [false],
     });

     constructor() {
       this.form.patchValue(this.flight);

       this.form.valueChanges.subscribe((flightForm) => {
         console.log("flight form changed:", flightForm);
       });

       this.form.controls.from.valueChanges.subscribe((from) => {
         console.log("from changed:", from);
       });
     }

     save(): void {
       this.flight = this.form.getRawValue();
       console.log("flight", this.flight);
     }

     close(): void {
       this.dialogRef.close();
     }
   }
   ```

   **Hint:** Please note that we imported the `ReactiveFormsModule` here.

1. Update the generated file `flight-edit-reactive.component.html` (`src/app/flight-edit-reactive/flight-edit-reactive.component.html`):

   ```html
   <div class="p40">
     <h2>Flight Edit (Reactive)</h2>

     <div class="alert alert-danger" *ngIf="!form.controls.from.valid">
       {{ form.controls.from.errors | json }}
     </div>

     <form [formGroup]="form">
       <input formControlName="id" />
       <input formControlName="from" />
       <input formControlName="to" />
       <input formControlName="date" />
       <input formControlName="delayed" type="checkbox" />
     </form>

     <div>
       <button (click)="save()" class="btn btn-default">Save</button>
       <button (click)="close()" class="btn btn-secondary">Close</button>
     </div>
   </div>
   ```

1. Update the file `flight-card.component.ts` (`src/app/flight-card/flight-card.component.ts`) so that it opens the new component when clicking on edit:

   ```diff
    import { CommonModule } from '@angular/common';
    import { initFlight } from '../model/flight';
    import { CityPipe } from '../shared/city.pipe';
    import { StatusToggleComponent } from '../status-toggle/status-toggle.component';
   -import { FlightEditComponent } from '../flight-edit/flight-edit.component';
   +import { FlightEditReactiveComponent } from '../flight-edit-reactive/flight-edit-reactive.component';

    @Component({
      selector: 'app-flight-card',

   [...]

      }

      edit() {
   -    this.dialog.open(FlightEditComponent, {
   +    this.dialog.open(FlightEditReactiveComponent, {
          data: { flight: this.item },
        });
      }
   ```

1. Try out your application.

## Custom Validator for Reactive Forms

Here, you add a custom reactive validator for validating city names.

1. Add a file `city-validator.ts` (`src/app/shared/validation/city-validator.ts`):

   ```typescript
   import {
     AbstractControl,
     ValidationErrors,
     ValidatorFn,
   } from "@angular/forms";

   export function validateCity(validCities: string[]): ValidatorFn {
     return (c: AbstractControl) => {
       if (c.value && validCities.indexOf(c.value) === -1) {
         return {
           city: {
             actualValue: c.value,
             validCities: validCities,
           },
         };
       }
       return null;
     };
   }
   ```

1. Open the file `flight-edit-reactive.component.ts` (`src/app/flight-edit-reactive/flight-edit-reactive.component.ts`) and change it as follows:

   ```diff
    import { CommonModule } from '@angular/common';
    import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
    import { Flight } from '../model/flight';
    import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
   +import { validateCity } from '../shared/validation/city-validator';
   +import { ValidationErrorsComponent } from '../shared/validation-errors/validation-errors.component';

    @Component({
      selector: 'app-flight-edit-reactive',
      standalone: true,
   -  imports: [CommonModule, ReactiveFormsModule],
   +  imports: [CommonModule, ReactiveFormsModule, ValidationErrorsComponent],
      templateUrl: './flight-edit-reactive.component.html',
      styleUrls: ['./flight-edit-reactive.component.css'],
    })

   [...]


      form = this.fb.nonNullable.group({
        id: [0],
   -    from: ['', [Validators.required, Validators.minLength(3)]],
   +    from: [
   +      '',
   +      [
   +        Validators.required,
   +        Validators.minLength(3),
   +        validateCity(['London', 'Paris', 'Berlin']),
   +      ],
   +    ],
        to: [''],
        date: [''],
        delayed: [false],
   ```

1. Open the file `flight-edit-reactive.component.html` (`src/app/flight-edit-reactive/flight-edit-reactive.component.html`) and change it as follows:

   ```diff
    <div class="p40">
      <h2>Flight Edit (Reactive)</h2>

   -  <div class="alert alert-danger" *ngIf="!form.controls.from.valid">
   -    {{ form.controls.from.errors | json }}
   -  </div>
   +  <app-validation-errors
   +    [errors]="form.controls['from'].errors ?? {}"
   +    field="from"
   +  ></app-validation-errors>

      <form [formGroup]="form">
        <input formControlName="id" />
   ```

1. Try out your application.

## Bonus: Custom Async Validator for Reactive Forms \*

In this lab, you add a reactive asynchronous validator for validating city names.

1. Add a file `async-city-validator.ts` (`src/app/shared/validation/async-city-validator.ts`):

   ```typescript
   import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
   import { delay, map } from "rxjs";
   import { FlightService } from "src/app/flight-search/flight.service";

   export function validateAsyncCity(
     flightService: FlightService
   ): AsyncValidatorFn {
     return (c: AbstractControl) => {
       return flightService.find(c.value, "").pipe(
         map((flights) => (flights.length > 0 ? null : { asyncCity: true })),
         delay(4000)
       );
     };
   }
   ```

1. Update the file `flight-edit-reactive.component.ts` (`src/app/flight-edit-reactive/flight-edit-reactive.component.ts`):

   ```diff
    import { Component, inject } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
    import { Flight } from '../model/flight';
    import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
    import { validateCity } from '../shared/validation/city-validator';
   +import { FlightService } from '../flight-search/flight.service';
   +import { validateAsyncCity } from '../shared/validation/async-city-validator';
    import { ValidationErrorsComponent } from '../shared/validation-errors/validation-errors.component';

    @Component({
      selector: 'app-flight-edit-reactive',
      standalone: true,
      imports: [CommonModule, ReactiveFormsModule, ValidationErrorsComponent],
      templateUrl: './flight-edit-reactive.component.html',
      styleUrls: ['./flight-edit-reactive.component.css'],
    })
    export class FlightEditReactiveComponent {
   -  private dialogRef = inject(MatDialogRef);
   +  private flightService = inject(FlightService);

   +  private dialogRef = inject(MatDialogRef);
      private data = inject<{ flight: Flight }>(MAT_DIALOG_DATA);
      flight = this.data.flight;

      private fb = inject(FormBuilder);

      form = this.fb.nonNullable.group({

   [...]

          '',
          [
            Validators.required,
            Validators.minLength(3),
            validateCity(['London', 'Paris', 'Berlin']),
          ],
   +      [validateAsyncCity(this.flightService)],
        ],
        to: [''],
        date: [''],
        delayed: [false],
      });
   ```

1. Open the file `flight-edit-reactive.component.html` (`src/app/flight-edit-reactive/flight-edit-reactive.component.html`) and change it as follows:

   ```diff
    field="from"
      ></app-validation-errors>

   +  <div class="alert alert-info" *ngIf="form?.controls?.['from']?.pending">
   +    Validating ...
   +  </div>
   +
      <form [formGroup]="form">
        <input formControlName="id" />
        <input formControlName="from" />
   ```

1. Try out your application.

## Bonus: Custom Multi Field Validator for Reactive Forms \*

Here, you add a custom reactive validator respecting several fields at once to prevent round trips.

1. Add a file `roundtrip-validator.ts` (`src/app/shared/validation/roundtrip-validator.ts`):

   ```typescript
   import {
     AbstractControl,
     FormGroup,
     ValidationErrors,
   } from "@angular/forms";

   export function validateRoundTrip(
     control: AbstractControl
   ): ValidationErrors | null {
     const group: FormGroup = control as FormGroup;

     const fromCtrl = group.controls["from"];
     const toCtrl = group.controls["to"];

     if (!fromCtrl || !toCtrl) {
       return null;
     }

     if (fromCtrl.value === toCtrl.value) {
       return {
         roundTrip: true,
       };
     }

     return null;
   }
   ```

1. Open the file `flight-edit-reactive.component.ts` (`src/app/flight-edit-reactive/flight-edit-reactive.component.ts`) and change it as follows:

   ```diff
    import { validateCity } from '../shared/validation/city-validator';
    import { FlightService } from '../flight-search/flight.service';
    import { validateAsyncCity } from '../shared/validation/async-city-validator';
    import { ValidationErrorsComponent } from '../shared/validation-errors/validation-errors.component';
   +import { validateRoundTrip } from '../shared/validation/roundtrip-validator';

    @Component({
      selector: 'app-flight-edit-reactive',

   [...]

      });

      constructor() {
   +    this.form.addValidators(validateRoundTrip);
   +
        this.form.patchValue(this.flight);

        this.form.valueChanges.subscribe((flightForm) => {
   ```

1. Open the file `flight-edit-reactive.component.html` (`src/app/flight-edit-reactive/flight-edit-reactive.component.html`) and change it as follows:

   ```diff
    field="from"
      ></app-validation-errors>

   +  <app-validation-errors
   +    [errors]="form.errors ?? {}"
   +    field="flight"
   +  ></app-validation-errors>
   +
      <div class="alert alert-info" *ngIf="form?.controls?.['from']?.pending">
        Validating ...
      </div>
   ```

1. Try out your application.
