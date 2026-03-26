import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule , MatButtonModule,MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatListModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private auth = inject(Auth);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}