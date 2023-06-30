import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
export const autenticacionGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem("accessToken") === null && localStorage.getItem("userName") === null ) {
    const router = inject(Router);
    router.navigate(["/login"]);
    return false;
  }
  return true;
};
