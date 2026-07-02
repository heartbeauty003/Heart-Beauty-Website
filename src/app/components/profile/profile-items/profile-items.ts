import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-items.html',
  styleUrl: './profile-items.css',
})
export class ProfileItems {
  @Input() activeSection: string = 'details';
  @Output() sectionChange = new EventEmitter<string>();

  isOpen = false;

  toggleMobile(): void {
    this.isOpen = !this.isOpen;
  }

  selectSection(section: string): void {
    this.sectionChange.emit(section);
    this.isOpen = false;
  }

  getActiveSectionTitle(): string {
    switch (this.activeSection) {
      case 'details': return 'User Details';
      case 'security': return 'Security';
      case 'address': return 'Address Book';
      case 'account': return 'Account Management';
      case 'logout': return 'Log Out';
      default: return 'Profile Navigation';
    }
  }
}