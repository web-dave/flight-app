import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabbedPaneComponent } from '../tabbed-pane/tabbed-pane.component';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
})
export class TabComponent {
  @Input() title = '';
  visible = true;

  setTitle(t: string) {
    this.title = t;
  }

  parent = inject(TabbedPaneComponent);
  constructor() {
    this.parent.register(this);
  }
}
