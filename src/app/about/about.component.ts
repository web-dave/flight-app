import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from '../shared/controls/tab/tab.component';
import { TabbedPaneComponent } from '../shared/controls/tabbed-pane/tabbed-pane.component';
import { ClickWithWarningDirective } from '../shared/controls/click-with-warning.directive';
import { TooltipDirective } from '../shared/tooltip.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [
    CommonModule,
    TabComponent,
    TabbedPaneComponent,
    ClickWithWarningDirective,
    TooltipDirective,
  ],
})
export class AboutComponent {
  deleteAll(): void {
    console.debug('delete ...');
  }
}
