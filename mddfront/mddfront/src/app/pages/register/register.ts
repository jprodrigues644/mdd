import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from 'express';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(Auth);
  private fb = inject(FormBuilder);
  private router: Router;

   registerForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(router :Router) {
    // Initialiser le formulaire avec validations
    this.router = router;
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required, 
        Validators.minLength(3),
       
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
       
      ]]
    });
  }

  onSubmit(): void {
    // Check that the form is valid
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    // Enable loading
    this.loading = true;
    this.errorMessage ="";
    
    // Call the authentication service
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log(' Registration successful', response);
        this.loading = false;
        // Redirection to /feed is managed in the service
      },
      error: (error) => {
        console.error(' Registration failed', error);
        this.loading = false;
        
        // Managing different types of errors
        if (error.status === 400) {
          if (error.error?.message?.includes('username')) {
            this.errorMessage = 'Ce nom d\'utilisateur est déjà utilisé';
          } else if (error.error?.message?.includes('email')) {
            this.errorMessage = 'Cet email est déjà utilisé';
          } else {
            this.errorMessage = 'Données invalides';
          }
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription';
        }
      }
    });
  }

}
