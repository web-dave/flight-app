import {
  Directive,
  Input,
  TemplateRef,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[cell]',
  standalone: true,
})
export class CellDirective implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  @Input('cellAs') propName = '';
  templateRef = inject(TemplateRef) as TemplateRef<unknown>;
}
