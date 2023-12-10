import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
  constructor(private router: Router, private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
