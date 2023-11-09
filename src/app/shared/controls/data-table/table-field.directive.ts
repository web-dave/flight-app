import { Directive, Input, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[appTableField]',
  standalone: true,
})
export class TableFieldDirective {
  @Input('appTableFieldAs') propName = '';
  templateRef = inject(TemplateRef) as TemplateRef<unknown>;
}
