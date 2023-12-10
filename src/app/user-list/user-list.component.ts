import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Person } from '../models/person';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  constructor(public userService: UserService) {}
}
