import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './security.html',
  styleUrl: './security.css',
})
export class Security implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  authStep: 'idle' | 'email' | 'success' = 'idle';
  resetForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

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

  initiateResetProcess(): void {
    this.authStep = 'email';
    this.errorMessage = null;
  }

  revertToIdle(): void {
    this.authStep = 'idle';
    this.resetForm.reset();
  }

  async handleReset() {
    if (this.resetForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;
    const email = this.resetForm.value.email;

    try {
      await this.authService.resetPassword(email);
      this.authStep = 'success';
    } catch (err: any) {
      console.error('Auth Exception Interface:', err);
      
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
}