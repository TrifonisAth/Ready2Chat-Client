import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private userId: number = this.userService.getUser()?.getId();
  private ws: WebSocket | undefined;
  private messageSub: Subject<any> = new Subject<any>();
  private messageSubject$: Observable<any> = this.messageSub.asObservable();
  private chatSub: Subject<any> = new Subject<any>();
  private chatObservable$: Observable<any> = this.chatSub.asObservable();
  private userSubscription: Subscription = new Subscription();

  constructor(private userService: UserService) {
    this.userSubscription = this.userService.userState.subscribe({
      next: (user) => {
        if (user.getId() !== this.userId) {
          this.userId = user.getId();
          console.log('id changed to: ', this.userId);
          if (+this.userId != 0) this.connect();
        }
      },
    });
  }

  connect(message = null): void {
    const ticket = this.userService.getUser().getTicket();
    const url = `${environment.WS_ENDPOINT}?` + ticket;
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      if (message) this.ws?.send(JSON.stringify(message));
    };
    this.ws.onmessage = (msg: any) => {
      const parsed = JSON.parse(msg.data);
      switch (parsed.event) {
        case 'text':
          this.chatSub.next(parsed.data);
          break;
        default:
          this.messageSub.next(msg);
      }
    };
    this.ws.onclose = (ev) => {
      console.log(ev.reason);
    };
    this.ws.onerror = (ev) => {
      console.log(ev);
    };
  }

  sendMessage(msg: any): void {
    if (msg === null) return;
    if (this.ws?.readyState === 3 || this.ws?.readyState === 2) {
      this.ws.close();
      this.connect(msg);
    }
    if (this.ws?.readyState === 0) {
      setTimeout(() => {
        this.sendMessage(msg);
      }, 1500);
      return;
    }
    this.ws?.send(JSON.stringify(msg));
  }

  getMessages() {
    return this.messageSubject$;
  }

  getChatMessagesObservable() {
    return this.chatObservable$;
  }

  getUserId(): number {
    return this.userId;
  }

  getSocket(): WebSocket | undefined {
    return this.ws;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  close() {
    this.ws?.close(3000, 'manual close');
  }
}
