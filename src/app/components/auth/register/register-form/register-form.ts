import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth';
import { UsersService } from '../../../../services/users/users.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css'
})
export class RegisterForm implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;
  registrationSuccess = false;
  isLoading = false;
  registeredEmail = '';

  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName:  ['', Validators.required],
      lastName:   ['', Validators.required],
      email:      ['', [Validators.required, Validators.email]],
      password:   ['', [Validators.required, Validators.minLength(8)]],
      mobile:     ['', Validators.required],
      newsletter: [true]
    });

    this.registerForm.valueChanges.subscribe(() => {
      if (this.errorMessage) this.errorMessage = null;
    });
  }

  goBackToHome(): void {
    this.router.navigate(['/']);
  }

  // ── Google ────────────────────────────────────────────────────────────────

  async onGoogleRegister(): Promise<void> {
    this.errorMessage = null;
    this.isLoading = true;
    try {
      const result = await this.authService.loginWithGoogle();
      const user = result.user;

      const nameParts = (user.displayName ?? '').split(' ');
      const firstName = nameParts[0] ?? '';
      const lastName  = nameParts.slice(1).join(' ') ?? '';

      const existing = await this.usersService.getUserProfile(user.uid);
      if (!existing) {
        await this.usersService.createUserProfile(user.uid, firstName, lastName, user.email ?? '');
      }

      this.registrationSuccess = true;
      this.cdr.detectChanges();
      setTimeout(() => this.router.navigate(['/']), 2000);
    } catch (err: any) {
      console.error(err);
      this.errorMessage = 'Google registration failed.';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // ── Facebook ──────────────────────────────────────────────────────────────

  async onFacebookRegister(): Promise<void> {
    this.errorMessage = null;
    this.isLoading = true;
    try {
      const result = await this.authService.loginWithFacebook();
      const user = result.user;

      const nameParts = (user.displayName ?? '').split(' ');
      const firstName = nameParts[0] ?? '';
      const lastName  = nameParts.slice(1).join(' ') ?? '';

      const existing = await this.usersService.getUserProfile(user.uid);
      if (!existing) {
        await this.usersService.createUserProfile(user.uid, firstName, lastName, user.email ?? '');
      }

      this.registrationSuccess = true;
      this.cdr.detectChanges();
      setTimeout(() => this.router.navigate(['/']), 2000);
    } catch (err: any) {
      console.error(err);
      this.errorMessage = 'Facebook registration failed.';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  // ── Email/Password Registration ───────────────────────────────────────────

  async onSubmit(): Promise<void> {
    if (!this.registerForm.valid) return;

    this.errorMessage = null;
    this.isLoading = true;

    const { firstName, lastName, email, password } = this.registerForm.value;

    try {
      const result = await this.authService.register(email, password);

      // Create the Firestore profile immediately while we still have the form
      // values in scope — this ensures firstName/lastName are never empty.
      if (result?.user?.uid) {
        const existing = await this.usersService.getUserProfile(result.user.uid);
        if (!existing) {
          await this.usersService.createUserProfile(result.user.uid, firstName, lastName, email);
        }
      }

      this.registeredEmail = email;
      this.registerForm.reset();
      this.isLoading = false;
      this.registrationSuccess = true;
      this.cdr.detectChanges();

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        this.errorMessage = 'This email is already registered.';
      } else {
        this.errorMessage = 'Registration failed. Please try again.';
      }
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}