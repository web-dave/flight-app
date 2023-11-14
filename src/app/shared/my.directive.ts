import {
  Directive,
  EmbeddedViewRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef,
  ViewRef,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appMy]',
  standalone: true,
  exportAs: 'appFooDir',
})
export class MyDirective implements OnInit {
  @Input() warning = 'Are you sure?';
  @Input() tmpl: TemplateRef<unknown> | undefined;
  @Output() appMy = new EventEmitter<boolean>();

  viewContainer = inject(ViewContainerRef);
  viewRef: EmbeddedViewRef<unknown> | undefined;

  @HostBinding('class') classBinding = 'btn btn-danger';

  @HostListener('click', ['$event.shiftKey'])
  handleClick(shiftKey: boolean): void {
    this.appMy.emit(shiftKey);
  }

  @HostListener('mouseenter')
  show() {
    this.viewRef?.rootNodes.forEach((n) => (n.hidden = false));
  }

  @HostListener('mouseleave')
  hide() {
    this.viewRef?.rootNodes.forEach((n) => (n.hidden = true));
  }

  ngOnInit(): void {
    if (this.tmpl) {
      this.viewRef = this.viewContainer.createEmbeddedView(this.tmpl, {
        $implicit: this.warning,
        class: 'danger',
      });
    }
  }
}
