import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { EMPTY, Subject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { switchAll, tap, catchError } from 'rxjs/operators';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private socket$: WebSocketSubject<any> = webSocket(environment.WS_ENDPOINT);
  private messageSubject$ = new Subject<any>();
  message$ = this.messageSubject$.pipe(
    switchAll(),
    catchError((e) => {
      throw e;
    })
  );

  private connections: Map<number, RTCPeerConnection> = new Map();
  private channels: Map<number, RTCDataChannel> = new Map();
  private connection: RTCPeerConnection = new RTCPeerConnection();
  private userId: number = this.userService.getUser()?.getId() || 1;

  constructor(private userService: UserService) {
    console.log('Connection service initialized');
    this.userService.user$.subscribe((user) => {
      this.userId = user.getId();
    });
    this.socket$.subscribe(
      (msg: any) => this.handleMessages(msg),
      (err: any) => console.log(err),
      () => console.log('complete')
    );
  }

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(
        tap({
          error: (error) => console.log(error),
        }),
        catchError((_) => EMPTY)
      );
      this.messageSubject$.next(messages);
    }
  }

  getNewWebSocket(): WebSocketSubject<any> {
    return webSocket(environment.WS_ENDPOINT);
  }

  sendMessage(msg: any): void {
    this.socket$.next(msg);
  }

  close(): void {
    this.socket$.complete();
  }

  handleMessages(msg: any) {
    const data = JSON.parse(msg);
    switch (data.event) {
      case 'offer':
        this.handleOffer(data);
        break;
      case 'answer':
        this.handleAnswer(data);
        break;
      case 'ice-candidate':
        this.handleCandidate(data);
        break;
    }
  }

  addTracks(stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      this.connection.addTrack(track, stream);
    });
  }

  private async handleOffer(message: Message) {
    const offer = message.data;
    const from: number = message.from;
    // If there is no connection with this peer, create one now.
    if (!this.connections.has(from)) {
      this.initConnection(from);
    }
    this.createAnswer(from);
  }

  private async handleAnswer(message: Message) {
    const answer = message.data;
    const from: number = message.from;
    await this.connections.get(from)?.setRemoteDescription(answer);
  }

  private handleCandidate(message: Message) {
    const candidate = message.data;
    const from: number = message.from;
    this.connections.get(from)?.addIceCandidate(candidate);
  }

  private async createOffer(recipientId: number) {
    const offer = await this.connections.get(recipientId)?.createOffer();
    if (!offer) return;
    await this.connections.get(recipientId)?.setLocalDescription(offer);
    const msg: Message = {
      event: 'offer',
      data: offer,
      to: recipientId,
      from: this.userId,
    };
    this.socket$.subscribe(
      (event: any) => {
        console.log('WebSocket event:', event);
        if (event.type === 'open') {
          this.socket$.next(JSON.stringify(msg));
        }
      },
      (err: any) => console.error('WebSocket error:', err),
      () => console.log('WebSocket closed')
    );
  }

  private async createAnswer(recipientId: number) {
    const answer = await this.connections.get(recipientId)?.createAnswer();
    if (!answer) return;
    await this.connections.get(recipientId)?.setLocalDescription(answer);
    const msg: Message = {
      event: 'answer',
      data: answer,
      to: recipientId,
      from: this.userId,
    };
    this.socket$.next(JSON.stringify(msg));
  }

  initConnection(id: number) {
    // This code might encounter issues
    // if a connection is already established with the peer.
    // What happens if user A is having a call with user B,
    // and user A wants to send a msg to B?
    console.log('Initializing connection with', id);
    const con = new RTCPeerConnection();
    this.connections.set(id, con);
    const chan = con.createDataChannel('dataChannel');
    this.channels.set(id, chan);

    chan.onopen = () => {
      console.log('Channel opened');
    };
    chan.onmessage = (event) => {
      if (event.data) console.log('Message received:', event.data);
      const message = JSON.parse(event.data);
      this.messageSubject$.next(message);
    };
    chan.onclose = () => {
      console.log('Channel closed');
    };
    con.onicecandidate = (event) => {
      if (event.candidate) {
        const msg: Message = {
          event: 'ice-candidate',
          data: event.candidate,
          to: id,
          from: this.userId,
        };
        this.socket$.next(JSON.stringify(msg));
      }
    };
  }

  send(msg: string, recipientId: number) {
    console.log(this.userService.getUser()?.getDisplayName(), 'sending', msg);
    console.log(this.userId);
    if (!this.connections.has(recipientId)) {
      this.initConnection(recipientId);
      this.createOffer(recipientId);
    }
    // Send the message after handling the answer.
    const channel = this.channels.get(recipientId);
    if (!channel) {
      console.log('Channel not found');
      return;
    }
    channel.onopen = () => {
      channel?.send(msg);
    };
  }

  setUserId(id: number) {
    this.userId = id;
  }
}
