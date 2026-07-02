import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class Logout {
  private auth = inject(Auth);
  private router = inject(Router);

  isLoading = false;

  async logout(): Promise<void> {
    this.isLoading = true;
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('[Logout] Failed to sign out:', error);
    } finally {
      this.isLoading = false;
    }
  }
}