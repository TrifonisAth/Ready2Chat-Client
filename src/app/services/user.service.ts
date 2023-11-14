import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: User | null = null;
  private isLogged = false;
  userSubject = new Subject<User>();
  user$ = this.userSubject.asObservable();
  // Friend list userId, name.
  private friends: Map<number, string> = new Map();

  constructor() {}

  getFriends(): Map<number, string> {
    return this.friends;
  }

  setFriends(friends: Map<number, string>): void {
    this.friends = friends;
  }

  isUserLogged(): boolean {
    return this.isLogged;
  }

  getUser(): User | null {
    return this.user;
  }

  setUser(user: User): void {
    this.user = user;
    this.isLogged = true;
    this.userSubject.next(user);
  }

  removeUser(): void {
    this.user = null;
    this.isLogged = false;
  }
}
