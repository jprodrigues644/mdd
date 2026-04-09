import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, MatButtonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  constructor(private router: Router) {}

  // Method for the "Connect" button
  onLoginClick(): void {
    
    this.router.navigate(['/login']);
  }

  // Method for the "Register" button
  onRegisterClick(): void {
    
    this.router.navigate(['/register']);
  }
}
