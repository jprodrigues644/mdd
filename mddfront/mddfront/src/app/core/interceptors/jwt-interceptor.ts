import { HttpInterceptorFn } from "@angular/common/http";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Find the JWT token in local storage
  const token = localStorage.getItem('token');
  
  // If no token is found, continue without modification
  if (!token) {
    return next(req);
  }
  
  // Clone the request and add the Authorization header
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  
  // Continue with the modified request
  return next(clonedRequest);
};