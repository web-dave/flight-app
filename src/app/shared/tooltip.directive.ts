import {
  Directive,
  EmbeddedViewRef,
  HostListener,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  viewContainer = inject(ViewContainerRef);
  viewRef: EmbeddedViewRef<unknown> | undefined;

  @Input('appTooltip') template: TemplateRef<unknown> | undefined;

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

  @HostListener('mouseover')
  mouseover() {
    this.setHidden(false);
  }

  @HostListener('mouseout')
  mouseout() {
    this.setHidden(true);
  }
}
