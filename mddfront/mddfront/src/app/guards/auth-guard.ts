import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verify if the user is authenticated by checking for a token in localStorage
  const token = localStorage.getItem('token');
  
  if (token) {
    //If a token exists, allow access to the route
    return true;
  }
  
  // No token found, redirect to the login page and deny access to the route
  console.log(' Access denied - No token found. Redirecting to login...');
  router.navigate(['/login']);
  return true;
};