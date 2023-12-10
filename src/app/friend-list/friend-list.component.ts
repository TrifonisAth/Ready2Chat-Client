import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { SearchService } from '../services/search.service';
import { Person } from '../models/person';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Friend } from '../models/friend';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss'],
})
export class FriendListComponent {
  private selectedTab: string =
    sessionStorage.getItem('selectedTab') || 'friends';
  private friends: Friend[] = Array.from(
    this.userService.getUser().getFriends().values()
  );
  private users: Person[] = this.userService.getUser().getOtherUsers();
  private query: string = '';
  private querySubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private auth: AuthService
  ) {}

  getSelectedTab(): string {
    return this.selectedTab;
  }

  getFriends(): Friend[] {
    if (!this.query) return this.friends;
    return this.friends.filter((friend) =>
      friend.getName().includes(this.query)
    );
  }

  getUsers(): Person[] {
    if (!this.query) return this.users;
    return this.users.filter((user) => user.getName().includes(this.query));
  }

  ngOnInit(): void {
    this.querySubscription = this.searchService.query$.subscribe((query) => {
      this.query = query;
    });

    this.userSubscription = this.userService.userState.subscribe((user) => {
      this.friends = Array.from(user.getFriends().values());
      this.users = user.getOtherUsers();
    });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  sendFriendRequest(id: number): void {
    this.auth.sendFriendRequest(id);
  }

  showFriends(): void {
    this.selectedTab = 'friends';
    sessionStorage.setItem('selectedTab', 'friends');
  }

  showUsers(): void {
    this.selectedTab = 'users';
    sessionStorage.setItem('selectedTab', 'users');
  }

  deleteFriend(id: number): void {
    this.auth.deleteFriend(id);
  }

  isPersonFriend(id: number): boolean {
    return this.userService.isPersonFriend(id);
  }

  deletePerson(id: number): void {
    const friendshipId = this.userService
      .getUser()
      .getFriendshipIdByPersonId(id);
    this.auth.deleteFriend(friendshipId);
  }

  hasSentFriendRequest(id: number): boolean {
    return this.userService.hasSentFriendRequest(id);
  }

  hasReceivedFriendRequest(id: number): boolean {
    return this.userService.hasReceivedFriendRequest(id);
  }

  getStatusText(id: number): string {
    if (this.hasSentFriendRequest(id)) return 'Sent request';
    if (this.hasReceivedFriendRequest(id)) return 'Received request';
    if (this.isPersonFriend(id)) return 'Friends';
    return 'Not friends';
  }

  cancelSentRequest(personId: number) {
    const id = this.userService.getUser().getSentRequestIdByPersonId(personId);
    this.auth.cancelRequest(id);
  }

  ignoreReceivedRequest(personId: number) {
    const id = this.userService
      .getUser()
      .getReceivedRequestIdByPersonId(personId);
    this.auth.cancelRequest(id);
  }

  acceptRequest(personId: number) {
    const id = this.userService
      .getUser()
      .getReceivedRequestIdByPersonId(personId);
    this.auth.acceptRequest(id);
  }

  isPersonOnline(id: number): boolean {
    return this.userService.isPersonOnline(id);
  }
}
