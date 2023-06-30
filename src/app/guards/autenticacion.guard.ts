import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import {inject} from '@angular/core';


export const autenticacionGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem("accessToken") === null ) {
    const router = inject(Router);
    router.navigate(["/login"]);
    return false;
  }
  return true;
};
