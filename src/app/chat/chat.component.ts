import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { UserService } from '../services/user.service';
import { WebsocketService } from '../services/websocket.service';
import { WebrtcService } from '../services/webrtc.service';
import { AuthService } from '../services/auth.service';
import { ChatMessage } from '../models/chatMessage';
import { Conversation } from '../models/converstion';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MediaService } from '../services/media.service';
import { Message } from '../models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @ViewChild('chat') chat: ElementRef | undefined;
  @ViewChild('messageList') messageList: ElementRef | undefined;
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
  chatSubscription: Subscription = new Subscription();

  constructor(
    // private connectionService: ConnectionService,
    private userService: UserService,
    private webrtcService: WebrtcService,
    private mediaService: MediaService,
    private webSocketService: WebsocketService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private router: Router
  ) {
    if (this.conversations.length === 0) return;
    this.selectConversation(this.conversations[0]);
  }

  makeCall(type: string): void {
    if (this.selectedConversation === null) return;

    this.webrtcService.setCallId(
      this.selectedConversation?.getFriend().getId()!
    );
    this.mediaService.setCallType(type);
    this.router.navigate(['/call']);
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.messages = conversation.getMessages();
    this.otherId = conversation.getFriend().getId();
    this.scrollToBottom();
  }

  ngOnInit(): void {
    console.log('Chat component initialized', this.userService.getUser());

    if (
      !(
        this.webSocketService.getSocket()?.OPEN ||
        this.webSocketService.getSocket()?.CONNECTING
      )
      // this.webSocketService.getSocket()?.CLOSED ||
      // this.webSocketService.getSocket()?.CLOSING
    ) {
      console.log('Connecting to websocket');

      this.webSocketService.connect();
    }

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

    this.chatSubscription = this.webSocketService
      .getChatMessagesObservable()
      .subscribe((message) => {
        const msg = new ChatMessage(message);
        this.messages.push(msg);
        this.cdr.detectChanges();
        this.scrollToBottom();
        this.messageSound.play();
      });
  }

  scrollToBottom() {
    this.messageList?.nativeElement.scrollTo({
      top:
        this.messageList.nativeElement.scrollHeight -
        this.messageList.nativeElement.clientHeight,
      behavior: 'smooth',
    });
    // this.cdr.detectChanges();
  }

  isScrolledToBottom(): boolean {
    const element = this.messageList?.nativeElement;
    if (element === undefined) return false;
    console.log(element.scrollHeight - element.scrollTop, element.clientHeight);
    return (
      element.scrollHeight - element.scrollTop <= element.clientHeight + 50
    );
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
    const msg: Message = new Message(
      'text',
      message,
      this.otherId,
      this.userService.getUser().getId()
    );
    // Display the message locally
    this.messages.push(message);
    // Send the message through the websocket.
    this.webSocketService.sendMessage(msg);
    // Send the message through the data channel
    // this.webrtcService.sendToPeer(message);
    // Store the message in the database
    this.auth.storeMessage(message);
    // Clear the input field
    this.newMessage = '';
  }

  ngOnDestroy(): void {
    console.log('Chat component destroyed');
    this.conversationSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.chatSubscription.unsubscribe();
  }
}
