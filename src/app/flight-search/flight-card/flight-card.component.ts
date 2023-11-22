import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  booleanAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from 'src/app/model/flight';
import { Subscription, interval, timer } from 'rxjs';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-card.component.html',
  styles: [
    `
      :host {
        display: block;
        background: hotpink;
      }
    `,
  ],
})
export class FlightCardComponent implements OnInit, OnChanges, OnDestroy {
  int: Subscription | undefined;
  ngOnInit(): void {
    console.log('INIT');
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
  }
  ngOnDestroy(): void {
    console.log('destroy');
    this.int?.unsubscribe();
  }
  @Input({ required: true }) item: Flight | undefined;
  @Input() selected = false;
  @Output() selectedChange = new EventEmitter<boolean>();

  select(e: any) {
    console.log(e);

    this.selected = true;
    this.selectedChange.emit(this.selected);
  }
  deselect() {
    this.selected = false;
    this.selectedChange.emit(this.selected);
  }

  constructor() {
    this.int = interval(500).subscribe((data) => console.log(data));

    // this.int = setInterval(() => {
    //   console.log('Tach');
    // }, 500);
  }
}
