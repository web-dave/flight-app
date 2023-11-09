import {
  Directive,
  EmbeddedViewRef,
  HostListener,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';

type TopToolContext = {
  $implicit: string;
  text: string;
};

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  viewContainer = inject(ViewContainerRef);
  viewRef: EmbeddedViewRef<TopToolContext> | undefined;

  @Input('appTooltip') template: TemplateRef<TopToolContext> | undefined;

  setHidden(hidden: boolean): void {
    this.viewRef?.rootNodes.forEach((nativeElement) => {
      nativeElement.hidden = hidden;
    });
  }

  ngOnInit(): void {
    if (!this.template) {
      return;
    }
    this.viewRef = this.viewContainer.createEmbeddedView(this.template, {
      $implicit: 'Tooltip!',
      text: 'Important Information!',
    });

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
