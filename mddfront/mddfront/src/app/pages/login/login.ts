import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private authService = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);


  loginForm: FormGroup;

  loading = false;
  errorMessage = '';
  
  // Initialize the form with validation rules
  constructor() {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required, Validators.minLength(8)],
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading = false;
        console.log('Login successful, navigating to feed...');
        // Navigation to feed is handled in the Auth service after successful login
      },
      error: (err) => {
       console.error(' Login failed', err);
        this.loading = false;
        
        // Gérer les différents types d'erreurs
        if (err.status === 401) {
          this.errorMessage = 'Identifiants invalides';
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la connexion';
        }
      }
    });

  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.hasError(errorType) && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} caractères`;
    }
    
    return '';
  }

   goBack(): void {
  this.router.navigate(['/']); // 
}


}
