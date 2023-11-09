# Directives: Deep Dive

[[TOC]]

For this lab, checkout the branch `lab302-directives-starter`:

```
git add *
git stash
git checkout lab302-directives-starter
```

## Implementing an Attribute Directive

In this lab, you implement an attribute directive for marking buttons triggering destructive actions (e. g. deleting a record). The directive adds the classes `btn btn-danger`. When clicking the button, the directive displays a warning before the button's action is triggered.

1. Generate a new `ClickWithWarningDirective`:

   ```bash
   ng g d shared/controls/click-with-warning --standalone
   ```

1. Open the file `click-with-warning.directive.ts` (`src/app/shared/controls/click-with-warning.directive.ts`) and make the directive to add the classes `btn btn-danger` to its host object:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { Directive, ElementRef, inject, OnInit } from "@angular/core";

   @Directive({
     selector: "[appClickWithWarning]",
     standalone: true,
   })
   export class ClickWithWarningDirective implements OnInit {
     elementRef = inject(ElementRef);

     ngOnInit(): void {
       this.elementRef.nativeElement.setAttribute("class", "btn btn-danger");
     }
   }
   ```

   </details><br>

1. Switch to the file `about.component.ts` (`src/app/about/about.component.ts`) and import the newly created `ClickWithWarningDirective`:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { Component } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { TabComponent } from '../shared/controls/tab/tab.component';
    import { TabbedPaneComponent } from '../shared/controls/tabbed-pane/tabbed-pane.component';
   +import { ClickWithWarningDirective } from '../shared/controls/click-with-warning.directive';

    @Component({
      selector: 'app-about',
      standalone: true,
      templateUrl: './about.component.html',
      styleUrls: ['./about.component.css'],
   -  imports: [CommonModule, TabComponent, TabbedPaneComponent],
   +  imports: [
   +    CommonModule,
   +    TabComponent,
   +    TabbedPaneComponent,
   +    ClickWithWarningDirective,
   +  ],
    })
    export class AboutComponent {}
   ```

   </details><br>

1. In the template `about.component.html` (`src/app/about/about.component.html`), add a button and apply the `ClickWithWarningDirective` to it:

   <details>
   <summary>Show Code</summary>

   ```diff
    <p>No cancelled flights!</p>
      </app-tab>
    </app-tabbed-pane>
   +
   +<button appClickWithWarning>Delete All!</button>
   ```

   </details><br>

1. Test your modifications:

   ```bash
   ng serve -o
   ```

## Working with HostBinding and HostListener

Now, let's add a `HostBindung` to set the button's class attribute and a `HostListener` to setup a click handler emitting a warning.

1. Open the file `click-with-warning.directive.ts` (`src/app/shared/controls/click-with-warning.directive.ts`) and add a `HostListener` as well as a click handler. The click handler should show a warning. When confirmed, it should trigger another event provided by the directive:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { Directive, ElementRef, inject, OnInit } from '@angular/core';
   +import { Dialog } from '@angular/cdk/dialog';
   +import {
   +  Directive,
   +  EventEmitter,
   +  HostBinding,
   +  HostListener,
   +  inject,
   +  Input,
   +  Output,
   +} from '@angular/core';

    @Directive({
      selector: '[appClickWithWarning]',
      standalone: true,
    })
   -export class ClickWithWarningDirective implements OnInit {
   -  elementRef = inject(ElementRef);
   +export class ClickWithWarningDirective {
   +  @Input() warning = 'Are you sure?';
   +  @Output() appClickWithWarning = new EventEmitter<void>();

   -  ngOnInit(): void {
   -    this.elementRef.nativeElement.setAttribute('class', 'btn btn-danger');
   +  @HostBinding('class') classBinding = 'btn btn-danger';
   +
   +  dialog = inject(Dialog);
   +
   +  @HostListener('click', ['$event.shiftKey'])
   +  handleClick(shiftKey: boolean): void {
   +    if (shiftKey || confirm(this.warning)) {
   +      this.appClickWithWarning.emit();
   +    }
      }
    }
   ```

   </details><br>

1. Switch to the file `about.component.ts` (`src/app/about/about.component.ts`) and add an event handler for the directive's event that just logs a message to the console:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { ClickWithWarningDirective } from '../shared/controls/click-with-warning
        ClickWithWarningDirective,
      ],
    })
   -export class AboutComponent {}
   +export class AboutComponent {
   +  deleteAll(): void {
   +    console.debug('delete ...');
   +  }
   +}
   ```

   </details><br>

1. Open the file `about.component.html` (`src/app/about/about.component.html`) and wire up the new event handler:

   <details>
   <summary>Show Code</summary>

   ```diff
    </app-tab>
    </app-tabbed-pane>

   -<button appClickWithWarning>Delete All!</button>
   +<button (appClickWithWarning)="deleteAll()">Delete All!</button>
   ```

   </details><br>

1. Try out your changes:

   ```bash
   ng serve -o
   ```

## Bonus: Using the Angular CDK Dialog

In the last lab, you've used the browser native confirm dialog that is an insult for the eye and blocks the browser thread. Now, let's switch it out for the Angular CDK's dialog.

To streamline this lab, the package `@angular/cdk` has already been installed into the starter kit.

1. Add a component to display within the CDK dialog:

   ```bash
   ng g c shared/confirm --standalone
   ```

1. Open the file `confirm.component.ts` (`src/app/shared/confirm/confirm.component.ts`) and get the passed data via the token `DIALOG_DATA`. Let's assume this is just a string with a message to display. Also, get the `DialogRef` allowing us the close the dialog later:

    <details>
    <summary>Show Code</summary>
    
    ```typescript
    import { Component, inject } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
    
    @Component({
      selector: 'app-confirm',
      standalone: true,
      imports: [CommonModule],
      templateUrl: './confirm.component.html',
      styleUrls: ['./confirm.component.css'],
    })
    export class ConfirmComponent {
      message = inject(DIALOG_DATA) as string;
      dialogRef = inject(DialogRef) as DialogRef<boolean>;
    
      close(decision: boolean): void {
        this.dialogRef.close(decision);
      }
    }
    ```
    
    </details><br>


   **Hint:** The template will display the message alongside a `yes` and `no` button. When clicking these buttons, the dialog should be closed and `true` or `false` should be returned to the caller.

1. Switch to the file `confirm.component.html` (`src/app/shared/confirm/confirm.component.html`) and implement the template:

   <details>
   <summary>Show Code</summary>

   ```html
   <div class="card">
     <div class="card-body">
       <p>{{ message }}</p>
       <button (click)="close(true)" class="btn btn-default">Yes</button>
       <button (click)="close(false)" class="btn btn-default">No</button>
     </div>
   </div>
   ```

   </details><br>

1. Open the file `click-with-warning.directive.ts` (`src/app/shared/controls/click-with-warning.directive.ts`) and call the CDK dialog with the before created component:

   <details>
   <summary>Show Code</summary>

   ```diff
    import {
      Input,
      Output,
    } from '@angular/core';
   +import { ConfirmComponent } from '../confirm/confirm.component';

    @Directive({
      selector: '[appClickWithWarning]',

   [...]


      @HostListener('click', ['$event.shiftKey'])
      handleClick(shiftKey: boolean): void {
   -    if (shiftKey || confirm(this.warning)) {
   +    if (shiftKey) {
          this.appClickWithWarning.emit();
   +      return;
        }
   +
   +    const ref = this.dialog.open<boolean>(ConfirmComponent, {
   +      data: this.warning,
   +    });
   +    ref.closed.subscribe((result) => {
   +      if (result) {
   +        this.appClickWithWarning.emit();
   +      }
   +    });
      }
    }
   ```

   </details><br>

1. Try out your changes:

   ```bash
   ng serve -o
   ```

## Bonus: Using exportAs

Like a component also a directive can be referenced via a handle. For this, you need to assign an alias to the directive.

1. Open the file `click-with-warning.directive.ts` (`src/app/shared/controls/click-with-warning.directive.ts`) and assign an alias using `exportAs`:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { ConfirmComponent } from '../confirm/confirm.component';

    @Directive({
      selector: '[appClickWithWarning]',
   +  exportAs: 'clickWithWarning',
      standalone: true,
    })
    export class ClickWithWarningDirective {

   [...]

      handleClick(shiftKey: boolean): void {
        if (shiftKey) {
          this.appClickWithWarning.emit();
   -      return;
        }

        const ref = this.dialog.open<boolean>(ConfirmComponent, {
   ```

   </details><br>

1. Switch to the file `about.component.html` (`src/app/about/about.component.html`) and get hold of a handle for the directive. Use it to interact with it:

   <details>
   <summary>Show Code</summary>

   ```diff
    </app-tab>
    </app-tabbed-pane>

   -<button (appClickWithWarning)="deleteAll()">Delete All!</button>
   +<button (appClickWithWarning)="deleteAll()" #cww="clickWithWarning">
   +  Delete All!
   +</button>
   +
   +<br /><br />
   +
   +<button (click)="cww.handleClick(true)">
   +  Delete without asking questions!
   +</button>
   ```

   </details><br>

1. Try out your changes:

   ```bash
   ng serve -o
   ```

## Templates and Programmatical Content Projection

In this lab, you create a `ToolTipDirective` that displays a template on mouseover.

1. Create a new `ToolTipDirective`:

   ```bash
   ng g d shared/tooltip --standalone
   ```

1. Open the file `tooltip.directive.ts` (`src/app/shared/tooltip.directive.ts`) and make the directive to take a template via an input. This template should be displayed on mouseover:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import {
     Directive,
     EmbeddedViewRef,
     inject,
     Input,
     TemplateRef,
     ViewContainerRef,
     HostListener,
   } from "@angular/core";

   @Directive({
     selector: "[appTooltip]",
     standalone: true,
   })
   export class TooltipDirective {
     viewContainer = inject(ViewContainerRef);
     viewRef: EmbeddedViewRef<unknown> | undefined;

     @Input("appTooltip") template: TemplateRef<unknown> | undefined;

     setHidden(hidden: boolean): void {
       this.viewRef?.rootNodes.forEach((nativeElement) => {
         nativeElement.hidden = hidden;
       });
     }

     ngOnInit(): void {
       if (!this.template) {
         return;
       }
       this.viewRef = this.viewContainer.createEmbeddedView(this.template);

       this.setHidden(true);
     }

     @HostListener("mouseover")
     mouseover() {
       this.setHidden(false);
     }

     @HostListener("mouseout")
     mouseout() {
       this.setHidden(true);
     }
   }
   ```

   </details><br>

1. Switch to the file `about.component.ts` (`src/app/about/about.component.ts`) and import the new directive:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { CommonModule } from '@angular/common';
    import { TabComponent } from '../shared/controls/tab/tab.component';
    import { TabbedPaneComponent } from '../shared/controls/tabbed-pane/tabbed-pane.component';
    import { ClickWithWarningDirective } from '../shared/controls/click-with-warning.directive';
   +import { TooltipDirective } from '../shared/tooltip.directive';

    @Component({
      selector: 'app-about',

   [...]

        TabComponent,
        TabbedPaneComponent,
        ClickWithWarningDirective,
   +    TooltipDirective,
      ],
    })
    export class AboutComponent {
   ```

   </details><br>

1. Open the file `about.component.html` (`src/app/about/about.component.html`) and use the new directive:

   <details>
   <summary>Show Code</summary>

   ```diff
    <button (click)="cww.handleClick(true)">
      Delete without asking questions!
    </button>
   +
   +<br /><br />
   +
   +<input [appTooltip]="tmpl" />
   +
   +<ng-template #tmpl>
   +  <h4>2 Tips for Success</h4>
   +  <ol>
   +    <li>Don't tell everything!</li>
   +  </ol>
   +</ng-template>
   ```

   </details><br>

1. Try out your changes:

   ```bash
   ng serve -o
   ```

## Passing a Context to an Template

Now, let's make the ToolTipDirective to pass a context object to the template containing a title and a text to display.

1. Open the file `tooltip.directive.ts` (`src/app/shared/tooltip.directive.ts`) and pass a dummy context object to the template:

   <details>
   <summary>Show Code</summary>

   ```diff
    import {
      HostListener,
    } from '@angular/core';

   +// Context Information to be passed to the template
   +type TipToolContext = {
   +  $implicit: string;
   +  text: string;
   +};
   +
    @Directive({
      selector: '[appTooltip]',
      standalone: true,
    })
    export class TooltipDirective {
      viewContainer = inject(ViewContainerRef);
   -  viewRef: EmbeddedViewRef<unknown> | undefined;
   +  viewRef: EmbeddedViewRef<TipToolContext> | undefined;

   -  @Input('appTooltip') template: TemplateRef<unknown> | undefined;
   +  @Input('appTooltip') template: TemplateRef<TipToolContext> | undefined;

      setHidden(hidden: boolean): void {
        this.viewRef?.rootNodes.forEach((nativeElement) => {

   [...]

        if (!this.template) {
          return;
        }
   -    this.viewRef = this.viewContainer.createEmbeddedView(this.template);
   +    this.viewRef = this.viewContainer.createEmbeddedView(this.template, {
   +      $implicit: 'Tooltip!',
   +      text: 'Important Information!',
   +    });

        this.setHidden(true);
      }
   ```

   </details><br>

1. Switch to the file `about.component.html` (`src/app/about/about.component.html`) and use the received context:

   <details>
   <summary>Show Code</summary>

   ```diff
    <input [appTooltip]="tmpl" />

   -<ng-template #tmpl>
   -  <h4>2 Tips for Success</h4>
   -  <ol>
   -    <li>Don't tell everything!</li>
   -  </ol>
   +<ng-template #tmpl let-title let-body="text">
   +  <h4>{{ title }}</h4>
   +  <p>
   +    {{ body }}
   +  </p>
    </ng-template>
   ```

   </details><br>

1. Try out your changes:

   ```bash
   ng serve -o
   ```

## Creating a Structural Directive

Now, let's create a structural directive that represents a template for a field in a data table. Let's also create a DataTableComponent that displays an array with data objects.

1. Create a new `TableFieldDirective`:

   ```bash
   ng g d shared/controls/data-table/table-field --standalone
   ```

1. Open the file `table-field.directive.ts` (`src/app/shared/controls/data-table/table-field.directive.ts`) and make the directive to expose its template via a property. Also an input propName should inform about the data object's property to display within the table field:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { Directive, inject, Input, TemplateRef } from "@angular/core";

   @Directive({
     selector: "[appTableField]",
     standalone: true,
   })
   export class TableFieldDirective {
     @Input("appTableFieldAs") propName = "";
     templateRef = inject(TemplateRef) as TemplateRef<unknown>;
   }
   ```

   </details><br>

1. Create a `DataTableComponent`:

   ```bash
   ng g c shared/controls/data-table --standalone
   ```

1. Open the file `data-table.component.ts` (`src/app/shared/controls/data-table/data-table.component.ts`) and add an input for the array with data objects to display. Also, via `ContentChildren`, take hold of the passed `DataFieldDirectives`:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { Component, ContentChildren, Input, QueryList } from "@angular/core";
   import { CommonModule } from "@angular/common";
   import { TableFieldDirective } from "./table-field.directive";

   @Component({
     selector: "app-data-table",
     standalone: true,
     imports: [CommonModule],
     templateUrl: "./data-table.component.html",
     styleUrls: ["./data-table.component.css"],
   })
   export class DataTableComponent {
     @Input() data: Array<any> = [];

     @ContentChildren(TableFieldDirective)
     fields: QueryList<TableFieldDirective> | undefined;

     get fieldList() {
       return this.fields?.toArray();
     }
   }
   ```

   </details><br>

1. Switch to the file `data-table.component.html` (`src/app/shared/controls/data-table/data-table.component.html`) and display the table with the data objects:

   <details>
   <summary>Show Code</summary>

   ```html
   <table class="table">
     <tr *ngFor="let row of data">
       <td *ngFor="let f of fieldList">
         <ng-container
           *ngTemplateOutlet="
             f.templateRef;
             context: { $implicit: row[f.propName] }
           "
         ></ng-container>
       </td>
     </tr>
   </table>
   ```

   </details><br>

1. Open the file `about.component.ts` (`src/app/about/about.component.ts`) and import the `DataTableComponent` as well as the `TableFieldDirective`:

    <details>
    <summary>Show Code</summary>
    
    ```diff
     import { TabComponent } from '../shared/controls/tab/tab.component';
     import { TabbedPaneComponent } from '../shared/controls/tabbed-pane/tabbed-pane.component';
     import { ClickWithWarningDirective } from '../shared/controls/click-with-warning.directive';
     import { TooltipDirective } from '../shared/tooltip.directive';
    +import { Flight } from '../model/flight';
    +import { DataTableComponent } from '../shared/controls/data-table/data-table.component';
    +import { TableFieldDirective } from '../shared/controls/data-table/table-field.directive';
     
     @Component({
       selector: 'app-about',
    
    [...]
    
         TabbedPaneComponent,
         ClickWithWarningDirective,
         TooltipDirective,
    +    DataTableComponent,
    +    TableFieldDirective,
       ],
     })
     export class AboutComponent {
    +  flights: Flight[] = [
    +    {
    +      id: 1,
    +      from: 'Hamburg',
    +      to: 'Berlin',
    +      date: '2025-02-01T17:00+01:00',
    +      delayed: false,
    +    },
    +    {
    +      id: 2,
    +      from: 'Hamburg',
    +      to: 'Frankfurt',
    +      date: '2025-02-01T17:30+01:00',
    +      delayed: false,
    +    },
    +    {
    +      id: 3,
    +      from: 'Hamburg',
    +      to: 'Mallorca',
    +      date: '2025-02-01T17:45+01:00',
    +      delayed: false,
    +    },
    +  ];
    +
       deleteAll(): void {
         console.debug('delete ...');
       }
    ```
    
    </details><br>


   **Hint:** For testing the data table, add a property with a flights array containing some sample objects.

1. Switch to the file `about.component.html` (`src/app/about/about.component.html`) and test the DataTable:

   <details>
   <summary>Show Code</summary>

   ```diff
    {{ body }}
      </p>
    </ng-template>
   +
   +<br /><br />
   +
   +<app-data-table [data]="flights">
   +  <div *appTableField="let data; as: 'id'">{{ data }}</div>
   +  <div *appTableField="let data; as: 'from'">{{ data }}</div>
   +  <div *appTableField="let data; as: 'to'">{{ data }}</div>
   +  <div *appTableField="let data; as: 'date'">
   +    {{ data | date : "dd.MM.yyyy HH:mm" }}
   +  </div>
   +</app-data-table>
   ```

   </details><br>

1. Try out your changes:

   ```bash
   ng serve -o
   ```

## Bonus: Implementing a Custom Template Outlet \*

In the previous lab, you used `ngTemplateOutlet` for displaying a template. Here, you hand-write an alternative that adds the template to a directive's view container.

1. Create a new `CustomTemplateOutletDirective`:

   ```bash
   ng g d shared/custom-template-outlet --standalone
   ```

1. Open the file `custom-template-outlet.directive.ts` (`src/app/shared/custom-template-outlet.directive.ts`) and make the new directive to receive a template and a context object via inputs:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import {
     Directive,
     inject,
     Input,
     TemplateRef,
     ViewContainerRef,
   } from "@angular/core";

   @Directive({
     selector: "[appCustomTemplateOutlet]",
     standalone: true,
   })
   export class CustomTemplateOutletDirective {
     @Input("appCustomTemplateOutlet") template:
       | TemplateRef<unknown>
       | undefined;
     @Input("appCustomTemplateOutletContext") context: any;

     viewContainer = inject(ViewContainerRef);

     ngOnInit(): void {
       if (!this.template) {
         return;
       }
       this.viewContainer.clear();

       const ref = this.viewContainer.createEmbeddedView(
         this.template,
         this.context
       );

       // Get first projected node
       // const nativeElement = ref.rootNodes[0]
     }
   }
   ```

   </details><br>

1. Switch to the file `data-table.component.ts` (`src/app/shared/controls/data-table/data-table.component.ts`) and import the `CustomTemplateOutletDirective`:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { Component, ContentChildren, Input, QueryList } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { TableFieldDirective } from './table-field.directive';
   +import { CustomTemplateOutletDirective } from '../../custom-template-outlet.directive';

    @Component({
      selector: 'app-data-table',
      standalone: true,
   -  imports: [CommonModule],
   +  imports: [CommonModule, CustomTemplateOutletDirective],
      templateUrl: './data-table.component.html',
      styleUrls: ['./data-table.component.css'],
    })
   ```

   </details><br>

1. Open the file `data-table.component.html` (`src/app/shared/controls/data-table/data-table.component.html`) and use the new directive instead of `ngTemplateOutlet`:

   <details>
   <summary>Show Code</summary>

   ```diff
    <tr *ngFor="let row of data">
        <td *ngFor="let f of fieldList">
          <ng-container
   -        *ngTemplateOutlet="
   +        *appCustomTemplateOutlet="
              f.templateRef;
              context: { $implicit: row[f.propName] }
            "
   ```

   </details><br>

1. Try out your changes:

   ```bash
   ng serve -o
   ```
