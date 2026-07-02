import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NotificationModel } from '../../models/notifications/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private firestore = inject(Firestore);

  getActiveNotifications(): Observable<NotificationModel[]> {
    return new Observable<NotificationModel[]>((subscriber) => {
      try {
        const ref = collection(this.firestore, 'notifications') as CollectionReference<DocumentData>;
        const q   = query(ref, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const items: NotificationModel[] = snapshot.docs
              .map(doc => ({
                id:        doc.id,
                title:     doc.data()['title']    ?? '',
                message:   doc.data()['message']  ?? '',
                type:      doc.data()['type']      ?? 'info',
                isActive:  doc.data()['isActive']  ?? false,
                createdAt: doc.data()['createdAt'] ?? ''
              }))
              .filter(n => n.isActive === true);
            subscriber.next(items);
          },
          (error) => {
            console.error('[NotificationsService] Snapshot error:', error);
            subscriber.next([]);
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.error('[NotificationsService] Error setting up stream:', err);
        subscriber.next([]);
        return () => {};
      }
    });
  }
}