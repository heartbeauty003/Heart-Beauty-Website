import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password-form.html',
  styleUrl: './reset-password-form.css',
})
export class ResetPasswordForm implements OnInit {
  authStep: 'email' | 'success' = 'email'; 
  resetForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm.get('email')?.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = null;
        this.cdr.detectChanges();
      }
    });
  }

  goBackToHome(): void {
    this.router.navigate(['/']);
  }

  async handleReset(): Promise<void> {
    if (this.resetForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;
    const email = this.resetForm.value.email;

    try {
      await this.authService.resetPassword(email);
      this.authStep = 'success';
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      
      if (err.code === 'auth/user-not-found') {
        this.errorMessage = 'Account does not exist.';
      } else if (err.code === 'auth/invalid-email') {
        this.errorMessage = 'The email address is badly formatted.';
      } else {
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }
}