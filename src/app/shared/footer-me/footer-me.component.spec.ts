import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterMeComponent } from './footer-me.component';

describe('FooterMeComponent', () => {
  let component: FooterMeComponent;
  let fixture: ComponentFixture<FooterMeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterMeComponent]
    });
    fixture = TestBed.createComponent(FooterMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
