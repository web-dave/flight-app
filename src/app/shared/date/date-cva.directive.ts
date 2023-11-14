import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { format, parse } from 'date-fns';

type OnChange = (value: Date) => void;
type OnTouched = () => void;

@Directive({
  selector: '[appDateCva]',
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
  @Input() appDateCva = 'dd.MM.yyyy HH:mm';

  @HostBinding('value') value = '';

  _onChange: OnChange = () => {};
  _onTouched: OnTouched = () => {};

  constructor() {}

  @HostListener('change', ['$event.target.value'])
  change(value: string): void {
    const date = value ? parse(value, 'dd.MM.yyyy', 0) : new Date();
    console.log('Change', value, date);
    this._onChange(date);
  }

  @HostListener('blur')
  blur(): void {
    this._onTouched();
  }

  writeValue(date: Date): void {
    console.log('write', date);

    const formatted = date ? format(date, 'dd.MM.yyyy') : '';
    this.value = formatted;
  }

  registerOnChange(fn: OnChange): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: OnTouched): void {
    this._onTouched = fn;
  }
}
