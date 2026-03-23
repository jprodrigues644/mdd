import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user';
import { UserResponse } from '../../shared/models/user.model';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  user: UserResponse | null = null;
  loading = true;
  saving = false;
  successMessage = '';
  errorMessage = '';

  profileForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.errorMessage = 'Impossible de charger le profil';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload: any = {
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
    };
    if (this.profileForm.value.password) {
      payload.password = this.profileForm.value.password;
    }

    this.userService.updateMe(payload).subscribe({
      next: (updated) => {
        this.user = updated;
        this.saving = false;
        this.successMessage = 'Profil mis à jour avec succès';
        this.profileForm.patchValue({ password: '' });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update failed', err);
        this.saving = false;
        this.errorMessage = 'Erreur lors de la mise à jour';
        this.cdr.detectChanges();
      }
    });
  }

  hasError(field: string, error: string): boolean {
    const f = this.profileForm.get(field);
    return !!(f?.hasError(error) && f.touched);
  }
}