import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordForm } from '../../../components/auth/reset-password/reset-password-form/reset-password-form';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ResetPasswordForm],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {}