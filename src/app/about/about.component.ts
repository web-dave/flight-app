import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from '../shared/controls/tab/tab.component';
import { TabbedPaneComponent } from '../shared/controls/tabbed-pane/tabbed-pane.component';
import { FooComponent } from '../shared/foo/foo.component';
import { map, tap, timer, interval } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TabComponent, TabbedPaneComponent, FooComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  cdr = inject(ChangeDetectorRef);

  list = [1, 2, 3, 4, 5, 6];
  user = { name: 'Michel' };
  users$ = interval(1500).pipe(
    tap((data) => console.log(data)),
    map((n) => ({ name: n + '' }))
  );

  constructor() {
    setTimeout(() => {
      this.user.name = 'Kalle!';

      this.list = [...this.list, 0];
    }, 1500);

    this.users$.subscribe((data) => {
      this.user = data;
      this.cdr.markForCheck();
    });
  }
}
