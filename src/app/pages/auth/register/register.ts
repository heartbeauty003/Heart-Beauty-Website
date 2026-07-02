import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterForm } from '../../../components/auth/register/register-form/register-form';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RegisterForm],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {}