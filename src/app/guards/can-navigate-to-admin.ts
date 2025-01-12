import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';

export const canNavigateToAdminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthenticationService)
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/not-found']);
    return false;
  } else {
    return true;
  }
};
