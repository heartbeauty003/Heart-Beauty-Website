import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { NotificationModel } from '../../../models/notifications/notification.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-list.html',
  styleUrl: './notifications-list.css'
})
export class NotificationsList implements OnInit, OnDestroy {
  private notificationsService = inject(NotificationsService);
  private cdr                  = inject(ChangeDetectorRef);
  private sub: Subscription | null = null;

  notifications: NotificationModel[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.sub = this.notificationsService.getActiveNotifications().subscribe({
      next: (items) => {
        this.notifications = items;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[NotificationsList] Failed to load notifications:', err);
        this.notifications = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'warning': return 'bi-exclamation-triangle-fill';
      case 'success': return 'bi-check-circle-fill';
      case 'error':   return 'bi-x-circle-fill';
      default:        return 'bi-info-circle-fill';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'warning': return 'notification-warning';
      case 'success': return 'notification-success';
      case 'error':   return 'notification-error';
      default:        return 'notification-info';
    }
  }
}