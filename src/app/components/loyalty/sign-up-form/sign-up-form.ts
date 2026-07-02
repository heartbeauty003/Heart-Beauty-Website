import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { UsersService } from '../../../services/users/users.service';
import { LoyaltyMemberDetails, HBUser } from '../../../models/user/user.model';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.css'
})
export class SignUpForm {
  private auth = inject(Auth);
  private usersService = inject(UsersService);

  @Input() user: HBUser | null = null;

  protected get isAlreadyMember(): boolean {
    return this.user?.isLoyaltyMember === true;
  }

  protected isLoading = false;
  protected successMessage = '';
  protected errorMessage = '';

  protected formData: Omit<LoyaltyMemberDetails, 'memberNo'> = {
    firstName: '',
    lastName: '',
    emailAddress: '',
  };

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.isAlreadyMember) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      const uid = this.auth.currentUser?.uid;
      if (!uid) throw new Error('You must be logged in to register.');

      await this.usersService.registerLoyaltyMember(uid, this.formData);

      this.successMessage = 'Welcome! You are now a loyalty member.';
      this.resetForm();
    } catch (err: any) {
      console.error('[SignUpForm] Loyalty registration failed:', err);
      this.errorMessage = err?.message ?? 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm(): void {
    this.formData = {
      firstName: '',
      lastName: '',
      emailAddress: '',
    };
  }
}
