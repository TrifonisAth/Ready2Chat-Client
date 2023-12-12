import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';
import { WebsocketService } from '../services/websocket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild('search') searchInput!: ElementRef;
  private showSearch = this.router.url.includes('friends');
  constructor(
    private router: Router,
    private searchService: SearchService,
    private websocketService: WebsocketService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('Dashboard component initialized');
  }

  // Create user search functionality.
  searchUsers() {
    const searchQuery = this.searchInput.nativeElement.value;
    this.searchService.querySubject.next(searchQuery);
  }

  showSearchBar() {
    return this.showSearch;
  }

  navigateToChat() {
    this.router.navigate(['/dashboard']);
    this.showSearch = false;
  }

  navigateToFriends() {
    this.router.navigate([
      '/dashboard',
      { outlets: { dashboardOutlet: ['friends'] } },
    ]);
    this.showSearch = true;
  }

  navigateToRequests() {
    this.router.navigate([
      '/dashboard',
      { outlets: { dashboardOutlet: ['requests'] } },
    ]);
    this.showSearch = false;
  }

  navigateToLogout() {
    this.router.navigate([
      '/dashboard',
      { outlets: { dashboardOutlet: ['logout'] } },
    ]);
    this.showSearch = false;
  }
}
