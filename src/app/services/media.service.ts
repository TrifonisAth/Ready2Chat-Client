import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private localStreamSubject = new BehaviorSubject<MediaStream | null>(null);
  private localScreenStreamSubject = new BehaviorSubject<MediaStream | null>(
    null
  );
  private localStream: MediaStream | null = null;
  private localScreenStream: MediaStream | null = null;
  private cameraActive = true;
  private micActive = true;
  private screenActive = false;
  private callActive = false;

  constructor() {}

  async stopLocalStream() {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => track.stop());
      this.localStreamSubject.next(this.localStream);
      this.cameraActive = false;
    }
  }

  async stopLocalScreenStream() {
    if (this.localScreenStream) {
      this.localScreenStream.getTracks().forEach((track) => track.stop());
      this.localScreenStream = null;
      this.localScreenStreamSubject.next(this.localScreenStream);
      this.screenActive = false;
    }
  }

  async initLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.callActive = true;
      this.cameraActive = true;
      this.micActive = true;
      this.localStreamSubject.next(this.localStream);
    } catch (err: any) {
      console.error('Error accessing user media:', err);
    }
    return this.localStream;
  }

  async initLocalScreenStream() {
    try {
      this.localScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      this.screenActive = true;
      this.localScreenStreamSubject.next(this.localScreenStream);
    } catch (err: any) {
      console.error('Error accessing user media:', err);
    }
  }

  async toggleScreen() {
    if (this.screenActive) {
      this.stopLocalScreenStream();
      return;
    }
    if (this.localScreenStream == null) {
      this.initLocalScreenStream();
    }
    const videoTrack = this.localScreenStream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = true;
      this.screenActive = true;
    }
  }

  // async toggleScreen() {
  //   if (this.localScreenStream == null) {
  //     await this.initLocalScreenStream();
  //   }
  //   const videoTrack = this.localScreenStream?.getVideoTracks()[0];
  //   if (videoTrack) {
  //     videoTrack.enabled = !videoTrack.enabled;
  //     this.screenActive = videoTrack.enabled;
  //   }
  // }

  async toggleMic() {
    const audioTrack = this.localStream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      this.micActive = audioTrack.enabled;
    }
  }

  async toggleCamera() {
    const videoTrack = this.localStream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      this.cameraActive = videoTrack.enabled;
    }
  }

  // async toggleCamera() {
  //   if (this.cameraActive) {
  //     this.stopLocalStream();
  //     return;
  //   }
  //   this.initLocalStream();
  //   const videoTrack = this.localStream?.getVideoTracks()[0];
  //   if (videoTrack) {
  //     videoTrack.enabled = !videoTrack.enabled;
  //     this.cameraActive = videoTrack.enabled;
  //   }
  // }

  async hangup() {
    try {
      this.stopLocalStream();
      this.stopLocalScreenStream();
      this.callActive = false;
      this.micActive = false;
    } catch (err: any) {
      console.error('Error hanging up:', err);
    }
  }

  isCameraActive() {
    return this.cameraActive;
  }

  isMicActive() {
    return this.micActive;
  }

  isScreenActive() {
    return this.screenActive;
  }

  getLocalStreamSubject() {
    return this.localStreamSubject;
  }

  getLocalScreenStreamSubject() {
    return this.localScreenStreamSubject;
  }

  getLocalStream() {
    return this.localStream;
  }

  getLocalScreenStream() {
    return this.localScreenStream;
  }

  isCallActive() {
    return this.callActive;
  }
}
