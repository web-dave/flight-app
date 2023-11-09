# Components: Deep Dive

[[TOC]]

## Content Projection

In this lab, you add a `TabComponent` that uses content projection.

1. Add a new tab component:

   ```bash
   ng g c shared/controls/tab --standalone
   ```

1. Open the file `tab.component.ts` (`src/app/shared/controls/tab/tab.component.ts`) and define an input `title` as well as a property `visible`:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { Component, Input } from "@angular/core";
   import { CommonModule } from "@angular/common";

   @Component({
     selector: "app-tab",
     standalone: true,
     imports: [CommonModule],
     templateUrl: "./tab.component.html",
     styleUrls: ["./tab.component.css"],
   })
   export class TabComponent {
     @Input() title = "";
     visible = true;
   }
   ```

   </details><br>

1. Switch to the file `tab.component.html` (`src/app/shared/controls/tab/tab.component.html`) and display the `title`. Also, add a `ng-content` element for content projection:

   <details>
   <summary>Show Code</summary>

   ```html
   <div *ngIf="visible">
     <h2>{{ title }}</h2>
     <ng-content></ng-content>
   </div>
   ```

   </details><br>

1. Open the file `about.component.ts` (`src/app/about/about.component.ts`) and import the new `TabComponent`:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { CommonModule } from "@angular/common";
   import { TabComponent } from "../shared/controls/tab/tab.component";

   @Component({
     selector: "app-about",
     standalone: true,
     templateUrl: "./about.component.html",
     styleUrls: ["./about.component.css"],
     imports: [CommonModule, TabComponent],
   })
   export class AboutComponent {}
   ```

   </details><br>

   **Remarks:** Your IDE might provide auto imports for this task when using the `TabComponent` for the first time in the template. In this case, you can skip this step.

1. Switch to the file `about.component.html` (`src/app/about/about.component.html`), call your `TabComponent`, and pass some content:

   <details>
   <summary>Show Code</summary>

   ```html
   <h1>Booking History</h1>

   <app-tab title="Upcoming Flights">
     <p>No upcoming flights!</p>
   </app-tab>

   <app-tab title="Operated Flights">
     <p>No operated flights!</p>
   </app-tab>

   <app-tab title="Cancelled Flights">
     <p>No cancelled flights!</p>
   </app-tab>
   ```

   </details><br>

1. Start your project, navigate to the menu item about and ensure yourself that the application works:

   ```bash
   ng serve -o
   ```

## Communication between Components

In this lab, you add a `TabbedPaneComponent` for grouping several tabs. It makes sure that only one tab is shown at a given time and enables the user to switch between them.

1. Add a new `TabbedPaneComponent`:

   ```bash
   ng g c shared/controls/tabbed-pane --standalone
   ```

1. Open the file `tabbed-pane.component.ts` (`src/app/shared/controls/tabbed-pane/tabbed-pane.component.ts`) and add some code to get hold of the tabs as well as to switch between them:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { AfterContentInit, Component } from "@angular/core";
   import { CommonModule } from "@angular/common";
   import { TabComponent } from "../tab/tab.component";

   @Component({
     selector: "app-tabbed-pane",
     standalone: true,
     imports: [CommonModule],
     templateUrl: "./tabbed-pane.component.html",
     styleUrls: ["./tabbed-pane.component.css"],
   })
   export class TabbedPaneComponent implements AfterContentInit {
     tabs: Array<TabComponent> = [];
     activeTab: TabComponent | undefined;

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
     }
   }
   ```

   </details><br>

1. Switch to the file `tabbed-pane.component.html` (`src/app/shared/controls/tabbed-pane/tabbed-pane.component.html`) and add some markup for switching between tabs. Also enable content projection:

   <details>
   <summary>Show Code</summary>

   ```html
   <div class="tabbed-pane">
     <div class="navigation">
       <span *ngFor="let tab of tabs" class="tab-link">
         <a [ngClass]="{ active: tab == activeTab }" (click)="activate(tab)"
           >{{ tab.title }}</a
         >
       </span>
     </div>

     <ng-content></ng-content>
   </div>
   ```

   </details><br>

1. In the file `tabbed-pane.component.css` (`src/app/shared/controls/tabbed-pane/tabbed-pane.component.css`), add some styles:

   <details>
   <summary>Show Code</summary>

   ```css
   .navigation {
     margin-bottom: 30px;
   }

   .tab-link {
     font-size: 16px;
     padding-bottom: 3px;
     border-bottom: 5px solid darkseagreen;
     margin-right: 10px;
   }

   .tab-link a {
     color: black;
     cursor: pointer;
   }

   .tab-link a:hover {
     color: orangered;
     text-decoration: none;
   }

   .tab-link a.active {
     color: orangered;
   }
   ```

   </details><br>

1. Open the file `tab.component.ts` (`src/app/shared/controls/tab/tab.component.ts`) and make sure the component registers itself with its parent `TabbedPaneComponent`:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { Component, Input } from '@angular/core';
   +import { Component, inject, Input } from '@angular/core';
    import { CommonModule } from '@angular/common';
   +import { TabbedPaneComponent } from '../tabbed-pane/tabbed-pane.component';

    @Component({
      selector: 'app-tab',

   [...]

    export class TabComponent {
      @Input() title = '';
      visible = true;
   +
   +  pane = inject(TabbedPaneComponent);
   +
   +  constructor() {
   +    this.pane.register(this);
   +  }
    }
   ```

   </details><br>

1. Switch to the file `about.component.ts` (`src/app/about/about.component.ts`) and import the new `TabbedPaneComponent`:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { Component } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { TabComponent } from '../shared/controls/tab/tab.component';
   +import { TabbedPaneComponent } from '../shared/controls/tabbed-pane/tabbed-pane.component';

    @Component({
      selector: 'app-about',
      standalone: true,
      templateUrl: './about.component.html',
      styleUrls: ['./about.component.css'],
   -  imports: [CommonModule, TabComponent],
   +  imports: [CommonModule, TabComponent, TabbedPaneComponent],
    })
    export class AboutComponent {}
   ```

   </details><br>

1. Open the file `about.component.html` (`src/app/about/about.component.html`) and try out the `TabbedPaneComponent`:

   <details>
   <summary>Show Code</summary>

   ```diff
    <h1>Booking History</h1>

   -<app-tab title="Upcoming Flights">
   -  <p>No upcoming flights!</p>
   -</app-tab>
   +<app-tabbed-pane>
   +  <app-tab title="Upcoming Flights">
   +    <p>No upcoming flights!</p>
   +  </app-tab>

   -<app-tab title="Operated Flights">
   -  <p>No operated flights!</p>
   -</app-tab>
   +  <app-tab title="Operated Flights">
   +    <p>No operated flights!</p>
   +  </app-tab>

   -<app-tab title="Cancelled Flights">
   -  <p>No cancelled flights!</p>
   -</app-tab>
   +  <app-tab title="Cancelled Flights">
   +    <p>No cancelled flights!</p>
   +  </app-tab>
   +</app-tabbed-pane>
   ```

   </details><br>

1. Start your project and try out the tabbed pane:

   ```bash
   ng serve -o
   ```

## Working with ContentChildren

In this lab, you directly reference the `TabComponents` via `ViewChildren`.

1. Open the file `tab.component.ts` (`src/app/shared/controls/tab/tab.component.ts`) and remove the code for registering with the parent `TabbedPaneComponent`:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { TabbedPaneComponent } from '../tabbed-pane/tabbed-pane.component';
    export class TabComponent {
      @Input() title = '';
      visible = true;
   -
   -  pane = inject(TabbedPaneComponent);
   -
   -  constructor() {
   -    this.pane.register(this);
   -  }
    }
   ```

   </details><br>

1. Switch to the file `tabbed-pane.component.ts` (`src/app/shared/controls/tabbed-pane/tabbed-pane.component.ts`) and reference the `TabComponent`s via the `ContentChildren` decorator:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { AfterContentInit, Component } from '@angular/core';
   +import {
   +  AfterContentInit,
   +  Component,
   +  ContentChildren,
   +  QueryList,
   +} from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { TabComponent } from '../tab/tab.component';

   [...]

      styleUrls: ['./tabbed-pane.component.css'],
    })
    export class TabbedPaneComponent implements AfterContentInit {
   -  tabs: Array<TabComponent> = [];
   +  @ContentChildren(TabComponent)
   +  tabQueryList: QueryList<TabComponent> | undefined;
   +
      activeTab: TabComponent | undefined;

   +  get tabs(): TabComponent[] {
   +    return this.tabQueryList?.toArray() ?? [];
   +  }
   +
      ngAfterContentInit(): void {
        if (this.tabs.length > 0) {
          this.activate(this.tabs[0]);
   ```

   </details><br>

1. Start your project and try out the tabbed pane:

   ```bash
   ng serve -o
   ```

## Adding a TabNavigator

For this lab, checkout the branch `lab301d-navigator`:

```
git add *
git stash
git checkout lab301d-navigator
```

This branch contains a new `TabNavigatorComponent` we are going to use in further labs.

1. Start your project and try out the new `TabNavigatorComponent` displayed in the `TabbedPaneComponent`.

1. Inspect the `TabNavigatorComponent` in the source code as well as how the `TabbedPaneComponent` communicates with it.

## Working with Handles

1. Open the file `tabbed-pane.component.html` (`src/app/shared/controls/tabbed-pane/tabbed-pane.component.html`) and add a handle for the `TabNavigatorComponent`. Use it to interact with the navigator:

   <details>
   <summary>Show Code</summary>

   ```diff
    <ng-content></ng-content>

      <app-tab-navigator
   +    #navigator
        [page]="this.currentPage"
        [pageCount]="this.tabs.length"
        (pageChange)="pageChange($event)"
      >
      </app-tab-navigator>
   +  <p>&nbsp;</p>
   +  <div>
   +    <button (click)="navigator.prev()">Prev</button>
   +    {{ navigator.page + 1 }}
   +    <button (click)="navigator.next()">Next</button>
   +  </div>
    </div>
   ```

   </details><br>

1. Start your project and try out the tabbed pane:

   ```bash
   ng serve -o
   ```

## Bonus: Working with ViewChildren\*

In this task, you directly reference the `TabNavigatorComponent` as a `ViewChildren` in your `TabbedPaneComponent`.

1. Open the file `tabbed-pane.component.ts` (`src/app/shared/controls/tabbed-pane/tabbed-pane.component.ts`) and change it as follows:

   <details>
   <summary>Show Code</summary>

   ```diff
    import {
      AfterContentInit,
   +  AfterViewInit,
   +  ChangeDetectorRef,
      Component,
      ContentChildren,
   +  inject,
      QueryList,
   +  ViewChild,
    } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { TabComponent } from '../tab/tab.component';

   [...]

      styleUrls: ['./tabbed-pane.component.css'],
      imports: [CommonModule, TabNavigatorComponent],
    })
   -export class TabbedPaneComponent implements AfterContentInit {
   +export class TabbedPaneComponent implements AfterContentInit, AfterViewInit {
      @ContentChildren(TabComponent)
      tabQueryList: QueryList<TabComponent> | undefined;

   +  @ViewChild('navigator')
   +  navigator: TabNavigatorComponent | undefined;
   +
      activeTab: TabComponent | undefined;

      currentPage = 0;

   +  cd = inject(ChangeDetectorRef);
   +
      get tabs(): TabComponent[] {
        return this.tabQueryList?.toArray() ?? [];
      }

   [...]

        }
      }

   +  ngAfterViewInit(): void {
   +    if (this.navigator) {
   +      this.navigator.page = 1;
   +      this.navigator.pageCount = this.tabs.length;
   +
   +      // Start another change detection cycle
   +      // Use this strategy with caution!
   +      this.cd.detectChanges();
   +
   +      this.navigator.pageChange.subscribe((page: number) => {
   +        this.pageChange(page);
   +      });
   +    }
   +  }
   +
      register(tab: TabComponent): void {
        this.tabs.push(tab);
      }
   ```

   </details><br>

1. Open the file `tabbed-pane.component.html` (`src/app/shared/controls/tabbed-pane/tabbed-pane.component.html`) and change it as follows:

   <details>
   <summary>Show Code</summary>

   ```diff
    <ng-content></ng-content>

   -  <app-tab-navigator
   -    #navigator
   -    [page]="this.currentPage"
   -    [pageCount]="this.tabs.length"
   -    (pageChange)="pageChange($event)"
   -  >
   -  </app-tab-navigator>
   +  <app-tab-navigator #navigator> </app-tab-navigator>
      <p>&nbsp;</p>
      <div>
        <button (click)="navigator.prev()">Prev</button>
   ```

   </details><br>

1. Start your project and try out the tabbed pane:

   ```bash
   ng serve -o
   ```

**Important:** Whenever possible, avoid using ViewChildren in favor of data binding.

## Bonus: Communicating via a Service \*

This exercise shows how to use a service to establish communication between components.

1. Execute the following command:

   ```bash
   ng g s shared/controls/tabbed-pane/tabbed-pane
   ```

1. Open the file `tabbed-pane.service.ts` (`src/app/shared/controls/tabbed-pane/tabbed-pane.service.ts`) and add BehaviorSubjects for managing the current page and the total page count:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { Injectable } from "@angular/core";
   import { BehaviorSubject } from "rxjs";

   @Injectable({
     providedIn: "root",
   })
   export class TabbedPaneService {
     readonly pageCount = new BehaviorSubject<number>(0);
     readonly currentPage = new BehaviorSubject<number>(1);

     constructor() {}
   }
   ```

   </details><br>

1. Switch to the file `tab-navigator.component.ts` (`src/app/shared/controls/tab-navigator/tab-navigator.component.ts`) and use the new service for getting the total page count and getting and updating the current page:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { Component, EventEmitter, Input, Output } from '@angular/core';
   +import {
   +  Component,
   +  EventEmitter,
   +  inject,
   +  Input,
   +  OnInit,
   +  Output,
   +} from '@angular/core';
    import { CommonModule } from '@angular/common';
   +import { TabbedPaneService } from '../tabbed-pane/tabbed-pane.service';

    @Component({
      selector: 'app-tab-navigator',

   [...]

      templateUrl: './tab-navigator.component.html',
      styleUrls: ['./tab-navigator.component.css'],
    })
   -export class TabNavigatorComponent {
   +export class TabNavigatorComponent implements OnInit {
      @Input() page = 0;
      @Input() pageCount = 0;
      @Output() pageChange = new EventEmitter<number>();

   +  service = inject(TabbedPaneService);
   +
   +  ngOnInit(): void {
   +    this.service.pageCount.subscribe((pageCount) => {
   +      this.pageCount = pageCount;
   +    });
   +    this.service.currentPage.subscribe((page) => {
   +      this.page = page;
   +    });
   +  }
   +
      prev(): void {
        this.page--;
        if (this.page < 0) {
          this.page = this.pageCount - 1;
        }
        this.pageChange.emit(this.page);
   +    this.service.currentPage.next(this.page);
      }

      next(): void {

   [...]

          this.page = 0;
        }
        this.pageChange.emit(this.page);
   +    this.service.currentPage.next(this.page);
      }
    }
   ```

   </details><br>

1. Open the file `tabbed-pane.component.ts` (`src/app/shared/controls/tabbed-pane/tabbed-pane.component.ts`) and use the new service for setting the total page count and for getting and updating the current page:

   <details>
   <summary>Show Code</summary>

   ```diff
    import {
    import { CommonModule } from '@angular/common';
    import { TabComponent } from '../tab/tab.component';
    import { TabNavigatorComponent } from '../tab-navigator/tab-navigator.component';
   +import { TabbedPaneService } from './tabbed-pane.service';

    @Component({
      selector: 'app-tabbed-pane',

   [...]

      templateUrl: './tabbed-pane.component.html',
      styleUrls: ['./tabbed-pane.component.css'],
      imports: [CommonModule, TabNavigatorComponent],
   +  providers: [TabbedPaneService],
    })
    export class TabbedPaneComponent implements AfterContentInit, AfterViewInit {
      @ContentChildren(TabComponent)

   [...]

      currentPage = 0;

      cd = inject(ChangeDetectorRef);
   +  service = inject(TabbedPaneService);

      get tabs(): TabComponent[] {
        return this.tabQueryList?.toArray() ?? [];

   [...]

      }

      ngAfterViewInit(): void {
   -    if (this.navigator) {
   -      this.navigator.page = 1;
   -      this.navigator.pageCount = this.tabs.length;
   +    this.service.pageCount.next(this.tabs.length);

   -      // Start another change detection cycle
   -      // Use this strategy with caution!
   -      this.cd.detectChanges();
   +    // Use this strategy with caution
   +    this.cd.detectChanges();

   -      this.navigator.pageChange.subscribe((page: number) => {
   -        this.pageChange(page);
   -      });
   -    }
   +    this.service.currentPage.subscribe((page: number) => {
   +      // Prevent cycle:
   +      if (page === this.currentPage) {
   +        return;
   +      }
   +      this.pageChange(page);
   +    });
      }

      register(tab: TabComponent): void {

   [...]

        this.activeTab = active;

        this.currentPage = this.tabs.indexOf(active);
   +    this.service.currentPage.next(this.currentPage);
      }

      pageChange(page: number): void {
   ```

   </details><br>

1. Start your project and try out the tabbed pane:

   ```bash
   ng serve -o
   ```
