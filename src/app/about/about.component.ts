import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from '../shared/controls/tab/tab.component';
import { TabbedPaneComponent } from '../shared/controls/tabbed-pane/tabbed-pane.component';
import { MyDirective } from '../shared/my.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [CommonModule, TabComponent, TabbedPaneComponent, MyDirective],
})
export class AboutComponent {
  ping(e: boolean) {
    console.log(e);
  }
}
