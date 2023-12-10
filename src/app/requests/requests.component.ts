import { ChangeDetectorRef, Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { FriendRequest } from '../models/friend-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent {
  private sentRequests: FriendRequest[] = Array.from(
    this.userService.getUser().getSentRequests().values()
  );
  private receivedRequests: FriendRequest[] = Array.from(
    this.userService.getUser().getReceivedRequests().values()
  );
  private userSubscription: Subscription = new Subscription();
  private selectedTab: string =
    sessionStorage.getItem('selectedTab-Requests') || 'sent';
  constructor(private auth: AuthService, public userService: UserService) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.userState.subscribe((user) => {
      this.sentRequests = Array.from(user.getSentRequests().values());
      this.receivedRequests = Array.from(user.getReceivedRequests().values());
    });
  }

  getSelectedTab(): string {
    return this.selectedTab;
  }

  getSentRequests() {
    return this.sentRequests;
  }

  getReceivedRequests() {
    return this.receivedRequests;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  showSent() {
    this.selectedTab = 'sent';
    sessionStorage.setItem('selectedTab-Requests', 'sent');
  }

  showReceived() {
    this.selectedTab = 'received';
    sessionStorage.setItem('selectedTab-Requests', 'received');
  }

  cancelRequest(requestId: number) {
    this.auth.cancelRequest(requestId);
  }

  acceptRequest(requestId: number) {
    this.auth.acceptRequest(requestId);
  }
}
