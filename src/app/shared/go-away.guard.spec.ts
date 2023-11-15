import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { goAwayGuard } from './go-away.guard';

describe('goAwayGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => goAwayGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
