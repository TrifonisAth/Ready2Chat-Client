import { ChatMessage } from './chatMessage';
import { Friend } from './friend';
import { Person } from './person';

export class Conversation {
  private conversationId: number;
  private messages: ChatMessage[];
  private friend: Person;
  private latestMessageTimestamp: Date;

  constructor(conversationDTO: any) {
    this.conversationId = conversationDTO.conversationId;
    this.messages = [];
    for (const msg of conversationDTO.messages) {
      this.messages.push(new ChatMessage(msg));
    }
    this.friend = new Person(conversationDTO.friend);
    this.latestMessageTimestamp = new Date(conversationDTO.lastMessageDate);
  }

  getConversationId(): number {
    return this.conversationId;
  }

  getMessages(): ChatMessage[] {
    return this.messages;
  }

  getFriend(): Person {
    return this.friend;
  }

  getLatestMessageTimestamp(): Date {
    return this.latestMessageTimestamp;
  }

  addMessage(message: ChatMessage): void {
    this.messages.push(message);
    this.latestMessageTimestamp = message.getTimestamp();
  }

  getLatestMessage(): ChatMessage {
    return this.messages[this.messages.length - 1];
  }
}
