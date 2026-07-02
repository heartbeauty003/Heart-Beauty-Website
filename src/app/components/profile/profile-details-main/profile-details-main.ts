import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountDetails } from '../profile-details/account-details/account-details';
import { AddressBook } from '../profile-details/address-book/address-book';
import { Security } from '../profile-details/security/security';
import { AccountManagement } from '../profile-details/account-management/account-management';
import { Logout } from '../profile-details/logout/logout';

@Component({
  selector: 'app-profile-details-main',
  standalone: true,
  imports: [
    CommonModule,
    AccountDetails,
    AddressBook,
    Security,
    AccountManagement,
    Logout
  ],
  templateUrl: './profile-details-main.html',
  styleUrl: './profile-details-main.css',
})
export class ProfileDetailsMain {
  @Input() activeSection: string = 'details';
}