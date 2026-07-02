import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsList } from '../../components/notifications/notifications-list/notifications-list';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NotificationsList],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications {}