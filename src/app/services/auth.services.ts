import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api/token/';
  isLoggedInSignal = signal<boolean>(!!localStorage.getItem('access_token'));

  constructor(private http: HttpClient) { }

  login(credentials: any) {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('username', credentials.username);
        this.isLoggedInSignal.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.clear();
    this.isLoggedInSignal.set(false);
  }

  getUsername() {
    return localStorage.getItem('username') || 'Guest';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}