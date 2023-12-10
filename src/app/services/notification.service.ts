import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationType, Notification } from '../interfaces/Notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  showNotification(type: NotificationType, message: string) {
    this.notificationSubject.next({ type, message } as Notification);
  }
}
