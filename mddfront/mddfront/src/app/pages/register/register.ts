import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.loading = false;
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.loading = false;
        if (error.status === 400) {
          if (error.error?.message?.includes('username')) {
            this.errorMessage = "Ce nom d'utilisateur est déjà utilisé";
          } else if (error.error?.message?.includes('email')) {
            this.errorMessage = 'Cet email est déjà utilisé';
          } else {
            this.errorMessage = 'Données invalides';
          }
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur';
        } else {
          this.errorMessage = "Une erreur est survenue lors de l'inscription";
        }
      }
    });
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.hasError(errorType) && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.hasError('required')) return 'Ce champ est obligatoire';
    if (field?.hasError('minlength')) {
      const min = field.errors?.['minlength'].requiredLength;
      return `Minimum ${min} caractères`;
    }
    if (field?.hasError('email')) return 'Veuillez entrer une adresse email valide';
    if (field?.hasError('maxlength')) {
      const max = field.errors?.['maxlength'].requiredLength;
      return `Maximum ${max} caractères`;
    }
    return '';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}