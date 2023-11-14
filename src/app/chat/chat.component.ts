import { Component } from '@angular/core';
import { ConnectionService } from '../services/connection.service';
import { UserService } from '../services/user.service';
import { NgForm } from '@angular/forms';
import { User } from '../models/user';
import { WebsocketService } from '../services/websocket.service';
import { WebrtcService } from '../services/webrtc.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  messages: { sender: string | undefined; text: string }[] = [];
  newMessage: string = '';
  otherId: number = 0;

  constructor(
    // private connectionService: ConnectionService,
    private userService: UserService,
    private webrtcService: WebrtcService
  ) {}

  ngOnInit(): void {
    console.log('Chat component initialized', this.userService.getUser());
    // Subscribe to incoming messages
    this.webrtcService.chatSubject$.subscribe((message) => {
      this.messages.push(message);
    });
  }

  sendMessage(): void {
    // Create a message object
    const message = this.newMessage;
    // Send the message through the data channel
    this.webrtcService.sendToPeer(message, this.otherId);

    // Display the message locally
    this.messages.push({
      sender: this.userService.getUser()?.getDisplayName(),
      text: message,
    });

    // Clear the input field
    this.newMessage = '';
  }
}
