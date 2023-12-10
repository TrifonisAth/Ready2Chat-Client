import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { WebsocketService } from './websocket.service';
import { map } from 'rxjs/internal/operators/map';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { Subject, Subscription } from 'rxjs';
import { ChatMessage } from '../models/chatMessage';

@Injectable({
  providedIn: 'root',
})
export class WebrtcService {
  private channelBuffers: Map<number, ChatMessage[]> = new Map();
  private peerConnections: Map<number, RTCPeerConnection> = new Map();
  private channels: Map<number, RTCDataChannel> = new Map();
  private remoteStream: MediaStream | null = null;
  private remoteStreamSubscription: Subject<MediaStream> =
    new Subject<MediaStream>();
  public remoteStreamStatus = this.remoteStreamSubscription.asObservable();

  private callId = 0;
  // Temporal.
  chatSubject$ = new Subject<any>();

  constructor(
    private webSocketService: WebsocketService,
    private userService: UserService
  ) {
    this.webSocketService.getMessages().subscribe({
      next: (msg) => {
        this.handleMessages(JSON.parse(msg.data));
      },
    });
  }

  ngOnInit() {}

  handleMessages(msg: any) {
    console.log('Message received: ', msg);
    switch (msg.event) {
      case 'offer':
        this.handleOffer(msg);
        break;
      case 'answer':
        this.handleAnswer(msg);
        break;
      case 'ice-candidate':
        this.handleCandidate(msg);
        break;
    }
  }

  private async handleOffer(message: Message) {
    const data = message.data;
    const otherId: number = message.from;
    // If there is no connection with this peer, create one now.
    if (!this.peerConnections.has(otherId)) {
      this.initPeerConnection(otherId);
      const pc = this.peerConnections.get(otherId);
      if (!pc) {
        console.error('Peer connection not found');
        return;
      }
      pc.ondatachannel = (event) => {
        const channel = event.channel;
        this.channels.set(otherId, channel);
        console.log('Data channel created by remote peer');

        channel.onmessage = (event) => {
          console.log('Message received: ', event);
          this.chatSubject$.next(event.data);
        };
      };
    }
    const sessionDescription = {
      sdp: data.sdp,
      type: data.type,
    };
    // Create an RTCSessionDescription object.
    const offer = new RTCSessionDescription(sessionDescription);
    // Set it as the remote description of the local peer connection.
    await this.peerConnections.get(otherId)?.setRemoteDescription(offer);
    if (
      this.peerConnections.get(otherId)?.signalingState !==
        'have-remote-offer' &&
      this.peerConnections.get(otherId)?.signalingState !==
        'have-local-pranswer'
    )
      return;
    this.createAnswer(otherId);
  }

  // Create a new RTCPeerConnection and Channel.
  initPeerConnection(otherId: number) {
    console.log('Initializing peer connection for id: ', otherId);
    const config = { iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }] };
    const peerConnection: RTCPeerConnection = new RTCPeerConnection(config);

    this.peerConnections.set(otherId, peerConnection);

    // Listen for local ICE candidates on the local RTCPeerConnection
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const msg: Message = new Message(
          'ice-candidate',
          event.candidate,
          otherId,
          this.userService.getUser()?.getId() || 0
        );
        // Upload the candidate to the server.
        this.webSocketService.sendMessage(msg);
      }
    };

    peerConnection.ontrack = (event) => {
      console.log('Track received: ', event);
      this.remoteStream = event.streams[0];
      this.remoteStreamSubscription.next(this.remoteStream);
    };

    // peerConnection.onnegotiationneeded = async () => {
    //   // test
    //   // if (peerConnection.signalingState !== 'stable') return;
    //   console.log('Negotiation needed');
    //   await this.negotiation(otherId);
    // };

    peerConnection.oniceconnectionstatechange = (event) => {
      if (peerConnection.iceConnectionState === 'failed') {
        console.log('Restarting ICE');
        peerConnection.restartIce();
      }
    };

    // // Listen for chat messages.
    // channel.onmessage = (event) => {
    //   console.log('Message received: ', event.data);
    //   this.chatSubject$.next(event.data);
    // };

    // channel.onopen = () => {
    //   console.log('Channel opened');
    //   console.log(channel);
    // };
  }

  private async negotiation(id: number) {
    const myId = this.userService.getUser()?.getId() || 0;
    // if (myId > id) return;
    let makingOffer = false;
    try {
      makingOffer = true;
      const pc = this.peerConnections.get(id);
      const offer = await pc?.createOffer();
      await pc?.setLocalDescription();
      const msg: Message = new Message('offer', pc?.localDescription, id, myId);
      this.webSocketService.sendMessage(msg);
    } catch (err) {
      console.error(err);
    } finally {
      makingOffer = false;
    }
  }

  private async perfectNegotiation(id: number) {}

  private async handleAnswer(message: Message) {
    const data = message.data;
    const otherId: number = message.from;
    const sessionDescription = {
      sdp: data.sdp,
      type: data.type,
    };
    const answer = new RTCSessionDescription(sessionDescription);
    // test
    if (this.peerConnections.get(otherId)?.signalingState === 'stable') return;
    await this.peerConnections.get(otherId)?.setRemoteDescription(answer);
  }

  private handleCandidate(message: Message) {
    const data = message.data;
    // Create RTCIceCandidateInit object
    const iceCandidateInit = {
      candidate: data.candidate,
      sdpMLineIndex: data.sdpMLineIndex,
      sdpMid: data.sdpMid,
      usernameFragment: data.usernameFragment,
    };
    const otherId: number = message.from;
    this.peerConnections.get(otherId)?.addIceCandidate(iceCandidateInit);
  }

  async createOffer(recipientId: number) {
    const offer = await this.peerConnections.get(recipientId)?.createOffer();
    console.log('Offer created: ', offer);
    if (!offer) return;
    await this.peerConnections.get(recipientId)?.setLocalDescription(offer);
    const msg: Message = new Message(
      'offer',
      offer,
      recipientId,
      this.userService.getUser()?.getId() || 0
    );
    this.webSocketService.sendMessage(msg);
  }

  private async createAnswer(recipientId: number) {
    // // test
    if (
      this.peerConnections.get(recipientId)?.signalingState !==
        'have-remote-offer' &&
      this.peerConnections.get(recipientId)?.signalingState !==
        'have-local-pranswer'
    )
      return;
    const answer = await this.peerConnections.get(recipientId)?.createAnswer();
    // if (!answer) return;
    await this.peerConnections.get(recipientId)?.setLocalDescription(answer);
    const msg: Message = new Message(
      'answer',
      answer,
      recipientId,
      this.userService.getUser()?.getId() || 0
    );

    // Upload the answer to the server.
    this.webSocketService.sendMessage(msg);
  }

  callPeer(recipientId: number) {
    this.setCallId(recipientId);
    this.initPeerConnection(recipientId);
  }

  async sendToPeer(message: ChatMessage) {
    let channel: RTCDataChannel | undefined;
    const recipientId = message.getRecipient().getId();
    if (this.channels.has(recipientId)) {
      channel = this.channels.get(recipientId);
      console.log('Using existing data channel');
    } else {
      await this.initPeerConnection(recipientId);
      console.log('Creating new peer connection');
      channel = this.createChannel(recipientId);
      await this.createOffer(recipientId);
    }
    if (channel?.readyState === 'open') {
      channel.send(JSON.stringify(message));
      console.log('Sending message: ', message);
    } else {
      console.log('Connection not established yet...');
      if (!this.channelBuffers.has(recipientId))
        this.channelBuffers.set(recipientId, []);
      this.channelBuffers.get(recipientId)?.push(message);

      channel!.onopen = () => {
        this.channelBuffers.get(recipientId)?.forEach((msg) => {
          console.log('Sending buffered message: ', msg);
          channel?.send(JSON.stringify(message));
        });
        this.channelBuffers.set(recipientId, []);
      };
    }
  }

  private createChannel(recipientId: number): RTCDataChannel {
    const channel = this.peerConnections
      .get(recipientId)
      ?.createDataChannel(recipientId.toString());
    if (channel) {
      this.channels.set(recipientId, channel);
      console.log('Data channel created.');

      channel.onmessage = (event) => {
        console.log('Message received: ', event.data);
        this.chatSubject$.next(event.data);
      };

      channel.onopen = () => {
        console.log('Channel opened');
        console.log(channel);
      };
    }
    return channel!;
  }

  getPeerConnections() {
    return this.peerConnections;
  }

  setCallId(id: number) {
    this.callId = id;
  }

  setTracks(localStream: MediaStream) {
    const pc = this.peerConnections.get(this.callId);
    console.log('set tracks to peer connection: ', pc);
    console.log('Setting tracks: ', localStream.getTracks());
    localStream.getTracks().forEach((track) => {
      pc?.addTrack(track, localStream);
    });
    this.createOffer(this.callId);
  }

  getRemoteStream() {
    return this.remoteStream;
  }

  getCallId() {
    return this.callId;
  }
}
