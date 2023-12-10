import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ConnectionService } from '../services/connection.service';
import { UserService } from '../services/user.service';
import { NgForm } from '@angular/forms';
import { User } from '../models/user';
import { WebsocketService } from '../services/websocket.service';
import { WebrtcService } from '../services/webrtc.service';
import { AuthService } from '../services/auth.service';
import { ChatMessage } from '../models/chatMessage';
import { Conversation } from '../models/converstion';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @ViewChild('chat') chat: ElementRef | undefined;
  // messages: { sender: string | undefined; text: string }[] = [];
  conversations: Conversation[] = this.userService
    .getUser()
    .getConversationsAll();
  messages: ChatMessage[] = [];
  newMessage: string = '';
  otherId: number = 0;
  messageSound = new Audio('assets/sounds/message.mp3');
  selectedConversation: Conversation | null = this.conversations[0];
  conversationSubscription: Subscription = new Subscription();
  userSubscription: Subscription = new Subscription();
  username: string = this.userService.getUser().getDisplayName();

  constructor(
    // private connectionService: ConnectionService,
    private userService: UserService,
    private webrtcService: WebrtcService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private router: Router
  ) {
    if (this.conversations.length === 0) return;
    this.selectConversation(this.conversations[0]);
  }

  makeCall(type: string): void {
    if (this.selectedConversation === null) return;
    console.log(
      'Making call to: ',
      this.selectedConversation.getFriend().getId()
    );
    this.webrtcService.setCallId(
      this.selectedConversation?.getFriend().getId()!
    );
    this.router.navigate(['/call']);
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.messages = conversation.getMessages();
    this.otherId = conversation.getFriend().getId();
  }

  ngOnInit(): void {
    console.log('Chat component initialized', this.userService.getUser());

    this.conversationSubscription =
      this.userService.conversationState.subscribe((conversations) => {
        this.conversations = conversations;
        this.selectConversation(this.conversations[0]);
      });

    this.userSubscription = this.userService.userState.subscribe((user) => {
      this.username = user.getDisplayName();
      this.conversations = this.userService.getUser().getConversationsAll();
      if (this.conversations.length === 0) return;
      this.selectConversation(this.conversations[0]);
    });

    // Subscribe to incoming messages
    this.webrtcService.chatSubject$.subscribe((message) => {
      const parsed = JSON.parse(message);
      const msg = new ChatMessage(parsed);
      this.messages.push(msg);
      this.cdr.detectChanges();
      this.messageSound.play();
    });
  }

  sendMessage(): void {
    // Create a message object
    const content = this.newMessage;
    const fId = this.userService
      .getUser()
      .getFriendshipIdByPersonId(this.otherId);
    console.log('fId: ', fId);
    const person = this.userService.getUser().getFriends().get(fId)?.toPerson();
    const message = new ChatMessage({
      sender: this.userService.getUser().toPerson(),
      recipient: person,
      message: content,
      friendshipId: fId,
      timestamp: new Date(),
    });
    // Display the message locally
    this.messages.push(message);
    // Send the message through the data channel
    this.webrtcService.sendToPeer(message);
    // Store the message in the database
    this.auth.storeMessage(message);
    // Clear the input field
    this.newMessage = '';
  }

  ngOnDestroy(): void {
    this.conversationSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
