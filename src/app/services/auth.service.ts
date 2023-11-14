import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RegisterCredential } from '../interfaces/RegisterCredential';
import { LoginCredential } from '../interfaces/LoginCredential';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiURL;
  private isAuthenticated = false;

  constructor(private http: HttpClient) {}

  register(credentials: RegisterCredential): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    return this.http.post(this.apiUrl + '/register', credentials, { headers });
  }

  login(credentials: LoginCredential): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    return this.http.post(this.apiUrl + '/login', credentials, { headers });
  }
}
