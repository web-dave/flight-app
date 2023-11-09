# Control Value Accessors

[[TOC]]

For this lab, checkout the branch `lab307-cva-starter`:

```
git add *
git stash
git checkout lab307-cva-starter
```

## ControlValueAccessor as Directives

In this lab, you implement a `ControlValueAccessor` that converts between a `Date` object and a formatted date (e.g. `dd.MM.yyyy HH:mm`).

For this, you can delegate to the `date-fns` package that is already part of your project. Its function `format` allows to format a `Date` Object and parse converts a formatted date back into a `Date` object.

1. Add a `DateCvaDirective`:

   ```bash
   ng g d shared/date/date-cva --standalone
   ```

1. Open the file `date-cva.directive.ts` (`src/app/shared/date/date-cva.directive.ts`) and implement the `ControlValueAccessor` interface:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { Directive, HostBinding, HostListener } from "@angular/core";
   import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
   import { format, parse } from "date-fns";

   type OnChange = (value: Date) => void;
   type OnTouched = () => void;

   @Directive({
     selector: "[appDateCva]",
     standalone: true,
     providers: [
       {
         provide: NG_VALUE_ACCESSOR,
         useExisting: DateCvaDirective,
         multi: true,
       },
     ],
   })
   export class DateCvaDirective implements ControlValueAccessor {
     _onChange: OnChange = () => {};
     _onTouched: OnTouched = () => {};

     @HostBinding("value")
     value = "";

     @HostListener("change", ["$event.target.value"])
     change(value: string): void {
       const date = value ? parse(value, "dd.MM.yyyy HH:mm", 0) : new Date();
       this._onChange(date);
     }

     @HostListener("blur")
     blur(): void {
       this._onTouched();
     }

     writeValue(date: Date): void {
       const formatted = date ? format(date, "dd.MM.yyyy HH:mm") : "";
       this.value = formatted;
     }
     registerOnChange(fn: OnChange): void {
       this._onChange = fn;
     }
     registerOnTouched(fn: any): void {
       this._onTouched = fn;
     }
   }
   ```

   </details><br>

1. Switch to the file `flight-search.component.ts` (`src/app/flight-booking/flight-search/flight-search.component.ts`) and import the `DateCvaDirective`. Also, add a property `date` holding a `Date` object:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { FormsModule } from '@angular/forms';
    import { FlightService } from './flight.service';
    import { CityPipe } from '../../shared/city.pipe';
    import { FlightCardComponent } from '../flight-card/flight-card.component';
   +import { DateCvaDirective } from 'src/app/shared/date/date-cva.directive';

    @Component({
      selector: 'app-flight-search',
      standalone: true,
      templateUrl: './flight-search.component.html',
      styleUrls: ['./flight-search.component.css'],
   -  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
   +  imports: [
   +    CommonModule,
   +    FormsModule,
   +    CityPipe,
   +    FlightCardComponent,
   +    DateCvaDirective,
   +  ],
    })
    export class FlightSearchComponent {
      from = 'London';

   [...]

      flights: Array<Flight> = [];
      selectedFlight: Flight | undefined;
      message = '';
   +  date = new Date();

      basket: Record<number, boolean> = {
        3: true,
   ```

   </details><br>

1. Open the file `flight-search.component.html` (`src/app/flight-booking/flight-search/flight-search.component.html`) and add an input box bound to the property date. Apply the `DateCvaDirective` to it:

   <details>
   <summary>Show Code</summary>

   ```diff
    <input [(ngModel)]="to" name="to" class="form-control" />
      </div>

   +  <div class="form-group">
   +    <label>Date:</label>
   +    <input [(ngModel)]="date" appDateCva name="date" class="form-control" />
   +    (Control Value: {{ date | date : "dd.MM.yyyy HH:mm" }})
   +  </div>
   +
      <div class="form-group">
        <button (click)="search()" class="btn btn-default">Search</button>
      </div>
   ```

   </details><br>

1. Test your modifications:

   ```bash
   ng serve -o
   ```

## ControlValueAccessor as Component

1. Open the file `date-stepper.component.ts` (`src/app/shared/date/date-stepper/date-stepper.component.ts`) and implement the `ControlValueAccessor` interface so that it can be used as a form control:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { Component, EventEmitter, Input, Output } from '@angular/core';
   +import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { addDays, subDays } from 'date-fns';
   +import { ControlValueAccessor, NgControl } from '@angular/forms';
   +
   +type OnChange = (value: Date) => void;
   +type OnTouched = () => void;

    @Component({
      selector: 'app-date-stepper',

   [...]

      templateUrl: './date-stepper.component.html',
      styleUrls: ['./date-stepper.component.css'],
    })
   -export class DateStepperComponent {
   -  @Input() date = new Date();
   -  @Output() dateChange = new EventEmitter<Date>();
   +export class DateStepperComponent implements ControlValueAccessor {
   +  ngControl = inject(NgControl);
   +  date = new Date();
   +  _onChange: OnChange = () => {};
   +
   +  constructor() {
   +    this.ngControl.valueAccessor = this;
   +  }
   +
   +  writeValue(date: Date): void {
   +    this.date = date ?? new Date();
   +  }
   +
   +  registerOnChange(fn: OnChange): void {
   +    this._onChange = fn;
   +  }
   +
   +  registerOnTouched(fn: OnTouched): void {
   +    // Not used here
   +  }

      next(): void {
        this.date = addDays(this.date, 1);
   -    this.dateChange.emit(this.date);
   +    this._onChange(this.date);
      }

      prev(): void {
        this.date = subDays(this.date, 1);
   -    this.dateChange.emit(this.date);
   +    this._onChange(this.date);
      }
    }
   ```

   </details><br>

1. Switch to the file `flight-search.component.ts` (`src/app/flight-booking/flight-search/flight-search.component.ts`) and import the `DateStepperComponent`:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { FlightService } from './flight.service';
    import { CityPipe } from '../../shared/city.pipe';
    import { FlightCardComponent } from '../flight-card/flight-card.component';
    import { DateCvaDirective } from 'src/app/shared/date/date-cva.directive';
   +import { DateStepperComponent } from 'src/app/shared/date/date-stepper/date-stepper.component';

    @Component({
      selector: 'app-flight-search',

   [...]

        CityPipe,
        FlightCardComponent,
        DateCvaDirective,
   +    DateStepperComponent,
      ],
    })
    export class FlightSearchComponent {
   ```

   </details><br>

1. Open the file `flight-search.component.html` (`src/app/flight-booking/flight-search/flight-search.component.html`) and display the date object with the `DateStepperComponent`:

   <details>
   <summary>Show Code</summary>

   ```diff
    </div>

      <div class="form-group">
   -    <label>Date:</label>
   -    <input [(ngModel)]="date" appDateCva name="date" class="form-control" />
   +    <app-date-stepper [(ngModel)]="date" name="date"></app-date-stepper>
        (Control Value: {{ date | date : "dd.MM.yyyy HH:mm" }})
      </div>
   ```

   </details><br>

1. Test your modifications:

   ```bash
   ng serve -o
   ```
