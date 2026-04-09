import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const unauthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // vefiries if a token exists in localStorage
  const token = localStorage.getItem('token');

  if (token) {
    // If a token exists → User already logged in, redirect to /feed and deny access
    
    router.navigate(['/feed']);
    return true;
  }

  // No token → Allow access to login/register pages
  return true;
};

