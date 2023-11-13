import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-foo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './foo.component.html',
  styleUrl: './foo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooComponent implements OnChanges {
  @Input() numbers: number[] = [];
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  @Input({ required: true }) user = { name: 'Kalle' };
}
