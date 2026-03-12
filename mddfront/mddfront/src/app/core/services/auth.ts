import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from 'express';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/auth.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {

   private http = inject(HttpClient);
  private router = inject(Router);
  
  // URL of the backend API 
  private apiUrl = 'http://localhost:8080/api/auth';

  // Method to handle user login
    login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          //Save the token to localStorage
          localStorage.setItem('token', response.token);
          
          // Optional: Save user information
          localStorage.setItem('user', JSON.stringify({
            id: response.id,
            username: response.username,
            email: response.email
          }));
          
          console.log(' Login successful - Token saved');
          
          // Redirect to feed
          this.router.navigate(['/feed']);
        })
      );
  }

  // Method to handle user logout
  logout(): void {
    // Remove token and user info from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log(' Logged out - Token removed');
    
    // Redirect to the landing page
    this.router.navigate(['/']);
  }
  // Method to handle user registration
   register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          // Save the token to localStorage
          localStorage.setItem('token', response.token);
          
          // Optional: Save user information
          localStorage.setItem('user', JSON.stringify({
            id: response.id,
            username: response.username,
            email: response.email
          }));
          
          console.log(' Registration successful - Token saved');
          
          // Redirect to the feed
          this.router.navigate(['/feed']);
        })
      );
  }

  // Method to check if the user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Method to get the current user's information
   getCurrentUser(): { id: number, username: string, email: string } | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }

      // Method to get the authentication token
      getToken(): string | null {
        return localStorage.getItem('token');
      }
      
}
