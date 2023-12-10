import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConnectionService } from '../services/connection.service';
import { MediaService } from '../services/media.service';
import { WebrtcService } from '../services/webrtc.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
  remoteStream: MediaStream | null = null;
  callSubscription: Subscription = new Subscription();

  constructor(
    private mediaService: MediaService,
    private webrtcService: WebrtcService,
    private router: Router
  ) {
    this.callSubscription = this.webrtcService.remoteStreamStatus.subscribe({
      next: (stream) => {
        this.remoteStream = stream;
        this.remoteVideo.nativeElement.srcObject = this.remoteStream;
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
    console.log(this.localStream);
    this.webrtcService.initPeerConnection(this.otherId);
    console.log('Peer connections:', this.webrtcService.getPeerConnections());
    this.webrtcService.setTracks(stream!);
  }

  hangup() {
    this.mediaService.hangup();
    this.router.navigate(['/dashboard']);
  }

  isCallActive() {
    return this.mediaService.isCallActive();
  }

  send(recipientId: number) {}
}
