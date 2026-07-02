import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginForm } from '../../../components/auth/login/login-form/login-form';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {}