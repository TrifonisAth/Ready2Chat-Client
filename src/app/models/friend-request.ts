import { Person } from './person';

export class FriendRequest {
  private requestId: number;
  private sender: Person;
  private recipient: Person;

  constructor(friendRequestDTO: any) {
    this.requestId = friendRequestDTO.requestId;
    this.sender = new Person(friendRequestDTO.sender);
    this.recipient = new Person(friendRequestDTO.recipient);
  }

  getRequestId(): number {
    return this.requestId;
  }

  getSender(): Person {
    return this.sender;
  }

  getRecipient(): Person {
    return this.recipient;
  }
}
