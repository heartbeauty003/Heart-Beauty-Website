import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { UsersService } from '../../../services/users/users.service';
import { HBUser } from '../../../models/user/user.model';

@Component({
  selector: 'app-loyalty-membership',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loyalty-membership.html',
  styleUrl: './loyalty-membership.css'
})
export class LoyaltyMembership implements OnInit {
  private auth = inject(Auth);
  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);

  protected isFlipped = false;
  protected user: HBUser | null = null;

  protected get memberName(): string {
    if (!this.user) return '';
    return `${this.user.firstName} ${this.user.lastName}`.toUpperCase();
  }

  protected get memberNo(): string {
    return this.user?.loyaltyMemberDetails?.memberNo ?? '—';
  }

  protected get signupDate(): string {
    if (!this.user?.createdAt) return '';
    const date = new Date(this.user.createdAt);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  protected get signatureInitials(): string {
    if (!this.user) return '';
    const first = this.user.firstName?.[0] ?? '';
    const last = this.user.lastName?.[0] ?? '';
    return `${first}.${last}`.toUpperCase();
  }

  async ngOnInit(): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    this.user = await this.usersService.getUserProfile(uid);
    this.cdr.detectChanges();
  }

  protected toggleCard(): void {
    this.isFlipped = !this.isFlipped;
  }
}