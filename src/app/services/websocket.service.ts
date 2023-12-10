import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, endWith } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private userId: number = this.userService.getUser()?.getId();
  private socketSubject$: any;
  private ws: WebSocket | undefined;
  // private messageSubject$: Observable<any> | undefined;
  private messageSub: Subject<any> = new Subject<any>();
  private messageSubject$: Observable<any> = this.messageSub.asObservable();
  private userSubscription: Subscription = new Subscription();

  constructor(private userService: UserService) {
    this.userSubscription = this.userService.userState.subscribe({
      next: (user) => {
        if (user.getId() !== this.userId) {
          this.userId = user.getId();
          console.log('id changed to: ', this.userId);
          if (+this.userId != 0) this.connect(this.userId);
        }
      },
    });
  }

  connect(id: number): void {
    const ticket = this.userService.getUser().getTicket();
    const url = `${environment.WS_ENDPOINT}?` + ticket;
    console.log(url);
    // this.ws = webSocket(url);
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      console.log('open');
    };
    this.ws.onmessage = (msg) => {
      this.messageSub.next(msg);
    };
    this.ws.onclose = () => {
      console.log('close');
    };
    // this.messageSubject$ = this.ws.asObservable();
  }

  // private getNewWebSocket() {
  //   return webSocket(`${environment.WS_ENDPOINT}?${this.userId}`);
  // }

  sendMessage(msg: any): void {
    this.ws?.send(JSON.stringify(msg));
  }

  getMessages() {
    return this.messageSubject$;
  }

  ngOnDestroy() {
    console.log('destroying websocket service');
    this.ws?.close();
    this.userSubscription.unsubscribe();
  }
}
