import { ChatMessage } from './chatMessage';
import { Conversation } from './converstion';
import { Friend } from './friend';
import { FriendRequest } from './friend-request';
import { Person } from './person';

export class User {
  private friends: Map<number, Friend> = new Map();
  private personId_FriendIdMap: Map<number, number> = new Map();
  private sentFriendRequests: Map<number, FriendRequest> = new Map();
  private sentFriendRequestsPersonId_RequestIdMap: Map<number, number> =
    new Map();
  private receivedFriendRequests: Map<number, FriendRequest> = new Map();
  private receivedFriendRequestsPersonId_RequestIdMap: Map<number, number> =
    new Map();
  private conversations: Conversation[] = [];
  private otherUsers: Person[] = [];
  private ticket: string = '';

  constructor(
    private displayName: string,
    private email: string,
    private id: number
  ) {}

  updateFriendRequests(requests: Set<FriendRequest>) {
    this.sentFriendRequests.clear();
    this.receivedFriendRequests.clear();
    this.sentFriendRequestsPersonId_RequestIdMap.clear();
    this.receivedFriendRequestsPersonId_RequestIdMap.clear();
    for (const r of requests) {
      const req = new FriendRequest(r);
      const sender = req.getSender();
      const recipient = req.getRecipient();
      if (sender.getId() == this.id) {
        this.sentFriendRequests.set(recipient.getId(), req);
        this.sentFriendRequestsPersonId_RequestIdMap.set(
          recipient.getId(),
          req.getRequestId()
        );
      } else {
        this.receivedFriendRequests.set(sender.getId(), req);
        this.receivedFriendRequestsPersonId_RequestIdMap.set(
          sender.getId(),
          req.getRequestId()
        );
      }
    }
  }

  getOtherUsers(): Person[] {
    return this.otherUsers;
  }

  setOtherUsers(otherUsers: Person[]): void {
    for (const user of otherUsers) {
      const person = new Person(user);
      if (person.getId() != this.id) {
        this.otherUsers.push(person);
      }
    }
  }

  setTicket(ticket: string): void {
    this.ticket = ticket;
  }

  getConversationsAll(): Conversation[] {
    return this.conversations;
  }

  setConversations(conversations: Conversation[]): void {
    for (const c of conversations.reverse()) {
      const conversation = new Conversation(c);
      console.log(conversation);
      this.conversations.push(conversation);
    }
  }

  removeSentRequest(id: number): void {
    this.sentFriendRequests.delete(id);
  }

  removeReceivedRequest(id: number): void {
    this.receivedFriendRequests.delete(id);
  }

  getReceivedRequests(): Map<number, FriendRequest> {
    return this.receivedFriendRequests;
  }

  getSentRequests(): Map<number, FriendRequest> {
    return this.sentFriendRequests;
  }

  getFriends(): Map<number, Friend> {
    return this.friends;
  }

  setFriends(friends: Set<Friend>): void {
    this.friends.clear();
    this.personId_FriendIdMap.clear();
    for (const f of friends) {
      const friend = new Friend(f);
      this.friends.set(friend.getFriendshipId(), friend);
      this.personId_FriendIdMap.set(friend.getId(), friend.getFriendshipId());
    }
  }

  getFriend(id: number): Friend | undefined {
    return this.friends.get(id);
  }

  addFriend(friend: Friend): void {
    this.friends.set(friend.getId(), friend);
  }

  removeFriend(id: number): void {
    this.friends.delete(id);
  }

  getTicket(): string {
    return this.ticket;
  }

  setToken(ticket: string): void {
    this.ticket = ticket;
  }

  getId(): number {
    return this.id;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  setDisplayName(displayName: string): void {
    this.displayName = displayName;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  isFriendOnline(id: number): boolean {
    const friend = this.friends.get(id);
    if (friend) {
      return friend.getIsOnline();
    }
    return false;
  }

  isPersonFriend(id: number): boolean {
    const fId = this.personId_FriendIdMap.get(id) || -1;
    return this.friends.has(fId);
  }

  hasSentFriendRequest(id: number): boolean {
    return this.sentFriendRequestsPersonId_RequestIdMap.has(id);
  }

  hasReceivedFriendRequest(id: number): boolean {
    return this.receivedFriendRequestsPersonId_RequestIdMap.has(id);
  }

  getFriendshipIdByPersonId(personId: number): number {
    return this.personId_FriendIdMap.get(personId)!;
  }

  getSentRequestIdByPersonId(personId: number): number {
    return this.sentFriendRequestsPersonId_RequestIdMap.get(personId)!;
  }

  getReceivedRequestIdByPersonId(personId: number): number {
    return this.receivedFriendRequestsPersonId_RequestIdMap.get(personId)!;
  }

  toPerson(): Person {
    return new Person({
      id: this.id,
      name: this.displayName,
    });
  }

  setFriendOnline(pId: number, isOnline: boolean): void {
    const fId = this.personId_FriendIdMap.get(pId);
    if (fId) {
      this.friends.get(fId)?.setIsOnline(isOnline);
    }
  }
}
