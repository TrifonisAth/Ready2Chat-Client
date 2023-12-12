import { Component, ElementRef, ViewChild } from '@angular/core';
import { MediaService } from '../services/media.service';
import { WebrtcService } from '../services/webrtc.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent {
  @ViewChild('localVideo', { static: true }) localVideo!: ElementRef;
  @ViewChild('localScreen', { static: true }) localScreen!: ElementRef;
  @ViewChild('remoteVideo', { static: true }) remoteVideo!: ElementRef;
  @ViewChild('remoteScreen', { static: true }) remoteScreen!: ElementRef;
  localStream: MediaStream | null = null;
  localScreenStream: MediaStream | null = null;
  callActive = true;
  otherId = this.webrtcService.getCallId();
  remoteStream: MediaStream | null = this.webrtcService.getRemoteStream();
  callSubscription: Subscription = new Subscription();

  constructor(
    private mediaService: MediaService,
    private webrtcService: WebrtcService,
    private router: Router,
    private websocketService: WebsocketService
  ) {
    this.callSubscription = this.webrtcService.remoteStreamStatus.subscribe({
      next: (stream) => {
        console.log('Remote stream received: ', stream);
        this.remoteStream = stream;
      },
    });
  }

  ngOnInit() {
    this.call();
  }

  isCameraActive() {
    return this.mediaService.isCameraActive();
  }

  isMicActive() {
    return this.mediaService.isMicActive();
  }

  isScreenActive() {
    return this.mediaService.isScreenActive();
  }

  toggleCamera() {
    this.mediaService.toggleCamera();
  }

  toggleMic() {
    this.mediaService.toggleMic();
    console.log(this.webrtcService.getPeerConnections());
  }

  toggleScreen() {
    this.mediaService.toggleScreen();
  }

  // TODO: move it to the service later.
  async call() {
    const stream = await this.mediaService.initLocalStream();
    this.localStream = stream;
    console.log('Stream promise:', stream);
    this.callActive = true;
    let pc = this.webrtcService.getPeerConnections().get(this.otherId) || null;
    if (!pc) {
      pc = this.webrtcService.initPeerConnection(this.otherId);
    }
    this.webrtcService.setTracks(stream!);
    console.log('before remote stream');
    this.remoteStream = this.webrtcService.getRemoteStream();
  }

  hangup() {
    this.mediaService.hangup();
    this.router.navigate(['/dashboard']);
    this.webrtcService.closePeerConnection(this.otherId);
    this.websocketService.close();
  }

  isCallActive() {
    return this.mediaService.isCallActive();
  }

  send(recipientId: number) {}
}
