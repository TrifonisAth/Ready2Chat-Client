import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Subject } from 'rxjs';
import { Friend } from '../models/friend';
import { Person } from '../models/person';
import { ChatMessage } from '../models/chatMessage';
import { Conversation } from '../models/converstion';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: User = new User('', '', 0);
  public userSubject: Subject<User> = new Subject<User>();
  public userState = this.userSubject.asObservable();
  public conversationSubject: Subject<Conversation[]> = new Subject<
    Conversation[]
  >();
  public conversationState = this.conversationSubject.asObservable();

  constructor() {}

  readUpdate(data: any) {}

  hasSentFriendRequest(personId: number): boolean {
    return this.user.hasSentFriendRequest(personId);
  }

  hasReceivedFriendRequest(personId: number): boolean {
    return this.user.hasReceivedFriendRequest(personId);
  }

  getUser(): User {
    return this.user;
  }

  setUser(user: User): void {
    this.user = user;
    this.userSubject.next(this.user);
  }

  readResponse(response: any): void {
    console.log(response);
    this.user = new User(
      response.user.username,
      response.user.email,
      response.user.userId
    );
    this.user.setFriends(response.friends);
    this.user.updateFriendRequests(response.requests);
    this.user.setConversations(response.inbox);
    this.user.setTicket(response.ticket);
    this.user.setOtherUsers(response.all_users);
    this.userSubject.next(this.user);
    this.conversationSubject.next(this.user.getConversationsAll());
  }

  // This method is used to update the user's friend requests every time
  // the requests are updated.
  setFriendRequests(response: any): void {
    this.user.updateFriendRequests(response.requests);
    this.userSubject.next(this.user);
  }

  setFriends(response: any): void {
    this.user.setFriends(response.friends);
    this.userSubject.next(this.user);
  }

  removeUser(): void {
    this.user = new User('', '', 0);
    this.userSubject.next(this.user);
  }

  isFriendOnline(id: number): boolean {
    return this.user.isFriendOnline(id);
  }

  isPersonFriend(id: number): boolean {
    return this.user.isPersonFriend(id);
  }

  isPersonOnline(id: number): boolean {
    const fId = this.user.getFriendshipIdByPersonId(id);
    return this.user.isFriendOnline(fId);
  }
}
