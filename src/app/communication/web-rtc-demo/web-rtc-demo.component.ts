import { Component, ElementRef, ViewChild } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { ConnectionService } from 'src/app/services/connection.service';

@Component({
  selector: 'app-web-rtc-demo',
  templateUrl: './web-rtc-demo.component.html',
  styleUrls: ['./web-rtc-demo.component.scss'],
})
export class WebRtcDemoComponent {
  @ViewChild('localVideo', { static: true }) localVideo!: ElementRef;
  @ViewChild('localScreen', { static: true }) localScreen!: ElementRef;
  @ViewChild('remoteVideo', { static: true }) remoteVideo!: ElementRef;
  @ViewChild('remoteScreen', { static: true }) remoteScreen!: ElementRef;
  localStream: MediaStream | null = null;
  localScreenStream: MediaStream | null = null;
  callActive = false;

  constructor(
    private mediaService: MediaService,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.initLocal();
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
  }

  toggleScreen() {
    this.mediaService.toggleScreen();
  }

  initLocal() {
    this.mediaService.getLocalStreamSubject().subscribe((stream) => {
      if (stream) {
        this.localVideo.nativeElement.srcObject = stream;
      }
    });

    this.mediaService.getLocalScreenStreamSubject().subscribe((stream) => {
      if (stream) {
        this.localScreen.nativeElement.srcObject = stream;
      }
    });
  }

  // TODO: move it to the service later.
  call() {
    this.mediaService.initLocalStream();
    this.callActive = true;
  }

  hangup() {
    this.mediaService.hangup();
  }

  isCallActive() {
    return this.mediaService.isCallActive();
  }

  send(recipientId: number) {}
}
