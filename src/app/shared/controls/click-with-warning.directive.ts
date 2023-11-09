import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appClickWithWarning]',
  standalone: true,
})
export class ClickWithWarningDirective implements OnInit {
  elementRef = inject(ElementRef);

  ngOnInit(): void {
    this.elementRef.nativeElement.setAttribute('class', 'btn btn-danger');
  }
}
