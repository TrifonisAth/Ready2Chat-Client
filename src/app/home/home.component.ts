import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { ConnectionService } from '../services/connection.service';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  userId: number = 0;

  constructor(
    private userService: UserService,
    private router: Router,
    // private connectionService: ConnectionService
    private websocketService: WebsocketService
  ) {}

  selectUser() {
    const user: User = new User(
      this.userId,
      this.userId.toString() + '-display',
      '3',
      '4'
    );
    console.log('User selected: ', user);
    this.userService.setUser(user);
    this.websocketService.connect(this.userId);
    this.router.navigate(['/chat']);
  }
}
