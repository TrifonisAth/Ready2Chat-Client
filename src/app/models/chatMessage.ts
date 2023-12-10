import { Person } from './person';

export class ChatMessage {
  private id: number;
  private friendshipId: number;
  private sender: Person;
  private recipient: Person;
  private message: string;
  private timestamp: Date = new Date();

  constructor(messageDTO: any) {
    this.id = messageDTO.messageId || null;
    this.friendshipId = messageDTO.friendshipId;
    this.timestamp = new Date(messageDTO.timestamp) || new Date();
    this.sender = new Person(messageDTO.sender);
    this.recipient = new Person(messageDTO.recipient);
    this.message = messageDTO.message;
  }

  getConversationId(): number {
    return this.friendshipId;
  }

  getId(): number {
    return this.id;
  }

  getSender(): Person {
    return this.sender;
  }

  getRecipient(): Person {
    return this.recipient;
  }

  getMessage(): string {
    return this.message;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}
