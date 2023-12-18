import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RegisterCredential } from '../interfaces/RegisterCredential';
import { LoginCredential } from '../interfaces/LoginCredential';
import { Observable, Subject } from 'rxjs';
import { LoaderService } from './loader.service';
import { NotificationService } from './notification.service';
import { NotificationType } from '../interfaces/Notification';
import { UserService } from './user.service';
import { EmailVerificationRequest } from '../interfaces/EmailVerificationRequest';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiURL;
  private registrationSubject: Subject<boolean> = new Subject<boolean>();
  private verificationSubject: Subject<boolean> = new Subject<boolean>();
  private loginSubject: Subject<boolean> = new Subject<boolean>();
  private reconnectSubject: Subject<boolean> = new Subject<boolean>();
  public reconnectStatus = this.reconnectSubject.asObservable();
  public registrationStatus = this.registrationSubject.asObservable();
  public verificationStatus = this.verificationSubject.asObservable();
  public loginStatus = this.loginSubject.asObservable();
  public isAuthenticated: boolean = false;
  private ticket: string = '';

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private userService: UserService,
    private router: Router
  ) {}

  storeMessage(message: any) {
    const headers = { 'content-type': 'application/json' };
    const res: Observable<any> = this.http.post(
      this.apiUrl + '/message/store',
      message,
      { headers, withCredentials: true }
    );
    res.subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
    return res;
  }

  verifyEmail(code: string): Observable<any> | undefined {
    const headers = { 'content-type': 'application/json' };
    const res: Observable<any> = this.http.post(this.apiUrl + '/verify', code, {
      headers,
      withCredentials: true,
    });

    res.subscribe({
      next: (response) => {
        this.notificationService.showNotification(
          NotificationType.Success,
          response.message
        );
        this.userService.setUser(response.user);
        this.verificationSubject.next(true);
        console.log(response);
      },
      error: (error) => {
        this.notificationService.showNotification(
          NotificationType.Error,
          error.error
        );
        console.log(error);
      },
    });
    return res;
  }

  register(credentials: RegisterCredential): Observable<any> {
    this.loaderService.show();
    const headers = { 'content-type': 'application/json' };
    const res: Observable<any> = this.http.post(
      this.apiUrl + '/register',
      credentials,
      { headers, withCredentials: true }
    );
    res.subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.notificationService.showNotification(
          NotificationType.Success,
          response.message
        );
        this.registrationSubject.next(true);
      },
      error: (error) => {
        this.loaderService.hide();
        this.notificationService.showNotification(
          NotificationType.Error,
          error.error
        );
        this.registrationSubject.next(false);
        console.log(error);
      },
    });
    return res;
  }

  login(credentials: LoginCredential): Observable<any> {
    this.loaderService.show();
    const headers = { 'content-type': 'application/json' };
    const res: Observable<any> = this.http.post(
      this.apiUrl + '/login',
      credentials,
      { headers, withCredentials: true }
    );
    res.subscribe({
      next: (response) => {
        console.log(response);
        this.loaderService.hide();
        this.isAuthenticated = true;
        this.notificationService.showNotification(
          NotificationType.Success,
          response.message
        );
        this.userService.readResponse(response);
        this.loginSubject.next(true);
      },
      error: (error) => {
        this.loaderService.hide();
        this.notificationService.showNotification(
          NotificationType.Error,
          error.error
        );
        this.registrationSubject.next(false);
        console.log(error);
      },
    });
    return res;
  }

  resendCode(): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const res: Observable<any> = this.http.get(this.apiUrl + '/resend', {
      headers,
    });
    res.subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.isAuthenticated = true;
        this.notificationService.showNotification(
          NotificationType.Success,
          response.message
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          NotificationType.Error,
          error.error
        );
        console.log(error);
      },
    });
    return res;
  }

  reconnect(): Observable<any> {
    this.loaderService.show();
    const headers = { 'content-type': 'application/json' };
    const res: Observable<any> = this.http.get(this.apiUrl + '/reconnect', {
      headers,
      withCredentials: true,
    });
    res.subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.isAuthenticated = true;
        this.notificationService.showNotification(
          NotificationType.Success,
          response.message
        );
        this.userService.readResponse(response);
      },
      error: (error) => {
        this.loaderService.hide();
        if (this.router.url !== '/login' && this.router.url !== '/register')
          this.router.navigate(['/login']);
      },
    });
    return res;
  }

  logout(): Observable<any> {
    this.loaderService.show();
    const headers = { 'content-type': 'application/json' };
    const res: Observable<any> = this.http.get(this.apiUrl + '/logout', {
      headers,
      withCredentials: true,
    });
    res.subscribe({
      next: (response) => {
        this.notificationService.showNotification(
          NotificationType.Success,
          response.message
        );
        this.userService.removeUser();
        this.router.navigate(['/login']);
        this.loaderService.hide();
      },
      error: (error) => {
        this.notificationService.showNotification(
          NotificationType.Error,
          error.error
        );
        console.log(error);
        this.loaderService.hide();
      },
    });
    return res;
  }

  sendFriendRequest(id: number): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const res: Observable<any> = this.http.post(
      this.apiUrl + `/friendRequest`,
      id,
      { headers, withCredentials: true }
    );
    res.subscribe({
      next: (response) => {
        this.userService.getUser().updateFriendRequests(response.requests);
        this.notificationService.showNotification(
          NotificationType.Success,
          response.message
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          NotificationType.Error,
          error.error
        );
        console.log(error);
      },
    });
    return res;
  }

  cancelRequest(id: number): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const res: Observable<any> = this.http.delete(
      this.apiUrl + `/friendRequest/${id}`,
      { headers, withCredentials: true }
    );
    res.subscribe({
      next: (response) => {
        this.userService.setFriendRequests(response);
        this.notificationService.showNotification(
          NotificationType.Success,
          response.message
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          NotificationType.Error,
          error.error
        );
        console.log(error);
      },
    });
    return res;
  }

  // cancelRequest(id: number): Observable<any> {
  //   const headers = { 'content-type': 'application/json' };
  //   const res: Observable<any> = this.http.post(
  //     this.apiUrl + '/friendRequest/delete',
  //     id,
  //     { headers, withCredentials: true }
  //   );
  //   res.subscribe({
  //     next: (response) => {
  //       this.userService.setFriendRequests(response);
  //       this.notificationService.showNotification(
  //         NotificationType.Success,
  //         response.message
  //       );
  //     },
  //     error: (error) => {
  //       this.notificationService.showNotification(
  //         NotificationType.Error,
  //         error.error
  //       );
  //       console.log(error);
  //     },
  //   });
  //   return res;
  // }

  acceptRequest(id: number): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const res: Observable<any> = this.http.post(
      this.apiUrl + `/friendRequest/${id}`,
      id,
      { headers, withCredentials: true }
    );
    res.subscribe({
      next: (response) => {
        this.userService.setFriendRequests(response);
        this.userService.setFriends(response);
        this.notificationService.showNotification(
          NotificationType.Success,
          response.message
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          NotificationType.Error,
          error.error
        );
        console.log(error);
      },
    });
    return res;
  }

  deleteFriend(id: number): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const res: Observable<any> = this.http.delete(
      this.apiUrl + `/friend/${id}`,
      { headers, withCredentials: true }
    );
    res.subscribe({
      next: (response) => {
        this.userService.setFriends(response);
        this.notificationService.showNotification(
          NotificationType.Success,
          response.message
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          NotificationType.Error,
          error.error
        );
        console.log(error);
      },
    });
    return res;
  }
}
