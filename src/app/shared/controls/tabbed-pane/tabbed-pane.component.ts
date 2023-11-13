import { Component, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from '../tab/tab.component';
import { TabNavigatorComponent } from '../tab-navigator/tab-navigator.component';

@Component({
  selector: 'app-tabbed-pane',
  standalone: true,
  imports: [CommonModule, TabNavigatorComponent],
  templateUrl: './tabbed-pane.component.html',
  styleUrl: './tabbed-pane.component.css',
})
export class TabbedPaneComponent implements AfterContentInit {
  // @ContentChildren(TabComponent)
  tabs: TabComponent[] = [];
  activeTab: TabComponent | undefined;
  currentPage = 0;

  ngAfterContentInit(): void {
    if (this.tabs.length > 0) {
      this.activate(this.tabs[0]);
    }
  }

  register(tab: TabComponent): void {
    this.tabs.push(tab);
  }

  activate(active: TabComponent): void {
    for (const tab of this.tabs) {
      tab.visible = tab === active;
    }
    this.activeTab = active;
    this.currentPage = this.tabs.indexOf(active);
  }

  pageChange(page: number) {
    this.activate(this.tabs[page]);
  }
}
