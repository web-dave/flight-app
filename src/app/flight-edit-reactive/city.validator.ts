import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { of, switchMap, tap, timer } from 'rxjs';

export function cityValidator(cities: string[]): ValidatorFn {
  return (c: AbstractControl) =>
    cities.includes(c.value) ? null : { city: 'invalid City' };
}

export function asyncCityValidator(): AsyncValidatorFn {
  return (c: AbstractControl) => {
    return timer(300).pipe(
      switchMap(() =>
        of({ cityAsync: true }).pipe(
          tap(() => console.log('Async check', c.value))
        )
      )
    );
  };
}

export function validateRoundTrip<ValidatorFn>(
  c: AbstractControl
): ValidationErrors | null {
  const form = c as FormGroup;
  const from = form.controls['from'].value as string;
  const to = form.controls['to'].value as string;
  return from === to ? { RoundTrip: true } : null;
}
