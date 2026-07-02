import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { LoyaltyInfo } from '../../components/loyalty/loyalty-info/loyalty-info';
import { LoyaltyMembership } from '../../components/loyalty/loyalty-membership/loyalty-membership';
import { SignUpForm } from '../../components/loyalty/sign-up-form/sign-up-form';
import { UsersService } from '../../services/users/users.service';
import { HBUser } from '../../models/user/user.model';

@Component({
  selector: 'app-loyalty',
  standalone: true,
  imports: [
    CommonModule,
    LoyaltyInfo,
    LoyaltyMembership,
    SignUpForm
  ],
  templateUrl: './loyalty.html',
  styleUrl: './loyalty.css'
})
export class Loyalty implements OnInit {
  private auth = inject(Auth);
  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);

  protected currentUser: HBUser | null = null;

  async ngOnInit(): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    this.currentUser = await this.usersService.getUserProfile(uid);
    this.cdr.detectChanges();
  }
}