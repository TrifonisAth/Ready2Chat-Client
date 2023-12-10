import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../interfaces/Notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  notification: Notification | null = null;
  private subscription: Subscription;

  constructor(private notificationService: NotificationService) {
    this.subscription = this.notificationService.notification$.subscribe(
      (notification: any) => {
        this.notification = notification as Notification;
        setTimeout(() => {
          this.notification = null;
        }, 5000);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
