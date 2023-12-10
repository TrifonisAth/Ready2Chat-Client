import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Ready2Chat';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated) {
      this.authService.reconnect();
    }
  }

  showTitle() {
    return (
      this.router.url === '/login' ||
      this.router.url === '/register' ||
      this.router.url === '/forgot-password' ||
      this.router.url === '/email-verification'
    );
  }
}
