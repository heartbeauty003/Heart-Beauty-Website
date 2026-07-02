import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileItems } from '../../components/profile/profile-items/profile-items';
import { ProfileDetailsMain } from '../../components/profile/profile-details-main/profile-details-main';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ProfileItems, ProfileDetailsMain],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  currentSection: string = 'details';

  onSectionChange(section: string): void {
    this.currentSection = section;
  }
}