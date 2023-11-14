import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from '../shared/controls/tab/tab.component';
import { TabbedPaneComponent } from '../shared/controls/tabbed-pane/tabbed-pane.component';
import { MyDirective } from '../shared/my.directive';
import { ClickWithWarningDirective } from '../shared/controls/click-with-warning.directive';
import { TooltipDirective } from '../shared/tooltip.directive';
import { CellDirective } from '../shared/cell.directive';
import { DataTableComponent } from '../shared/controls/data-table/data-table.component';
import { Flight } from '../model/flight';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [
    CommonModule,
    TabComponent,
    TabbedPaneComponent,
    MyDirective,
    ClickWithWarningDirective,
    TooltipDirective,
    CellDirective,
    DataTableComponent,
  ],
})
export class AboutComponent {
  flights: Flight[] = [
    {
      id: 1,
      from: 'Hamburg',
      to: 'Berlin',
      date: '2025-02-01T17:00+01:00',
      delayed: false,
    },
    {
      id: 2,
      from: 'Hamburg',
      to: 'Frankfurt',
      date: '2025-02-01T17:30+01:00',
      delayed: false,
    },
    {
      id: 3,
      from: 'Hamburg',
      to: 'Mallorca',
      date: '2025-02-01T17:45+01:00',
      delayed: false,
    },
  ];
  ping(e: boolean) {
    console.log(e);
  }
  deleteAll(): void {
    console.debug('delete ...');
  }
  data = {
    name: 'Christian',
  };
  liste = [{ name: 'a' }, { name: 'b' }];
}
