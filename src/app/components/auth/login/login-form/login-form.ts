import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth';
import { UsersService } from '../../../../services/users/users.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginForm implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;
  isLoading = false;

  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  goBackToHome(): void {
    this.router.navigate(['/']);
  }

  onGoogleLogin() {
    this.errorMessage = null;
    this.isLoading = true;
    this.authService.loginWithGoogle()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((err: any) => {
        console.error(err);
        this.errorMessage = 'Google login failed. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  onFacebookLogin() {
    this.errorMessage = null;
    this.isLoading = true;
    this.authService.loginWithFacebook()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((err: any) => {
        console.error(err);
        this.errorMessage = 'Facebook login failed.';
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword() {
    this.router.navigate(['/reset-password']);
  }

  switchToRegister() {
    this.router.navigate(['/register']);
  }

  async onSubmit() {
    if (!this.loginForm.valid) return;

    this.errorMessage = null;
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.loginWithEmail(email, password, this.usersService);
      this.router.navigate(['/']);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-not-verified') {
        this.errorMessage = 'Please verify your email before logging in. Check your inbox for the activation link.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        this.errorMessage = 'Invalid email or password.';
      } else {
        this.errorMessage = 'Login failed. Please try again.';
      }
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}