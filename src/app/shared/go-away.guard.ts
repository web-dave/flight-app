import { CanActivateFn, CanActivateChildFn } from '@angular/router';

export const goAwayGuard: CanActivateFn = (route, state) => {
  return confirm('Echt?');
};
