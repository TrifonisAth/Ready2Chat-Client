import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private userId: number = 0;
  private socketSubject$: any;
  private ws: WebSocketSubject<any> | undefined;
  private messageSubject$: Observable<any> | undefined;

  constructor() {}

  connect(id: number): void {
    this.ws = webSocket(`${environment.WS_ENDPOINT}?${id}`);
    this.messageSubject$ = this.ws.asObservable();
    this.userId = id;
  }

  private getNewWebSocket() {
    return webSocket(`${environment.WS_ENDPOINT}?${this.userId}`);
  }

  sendMessage(msg: any): void {
    this.ws?.next(msg);
  }

  close(): void {
    this.ws?.complete();
  }

  getMessages() {
    return this.messageSubject$;
  }
}
