import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://127.0.0.1:8000/api/notifications';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`, { headers: this.getAuthHeaders() });
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${this.apiUrl}/read-all/`, {}, { headers: this.getAuthHeaders() });
  }

  getNotificationPreferences(): Observable<any> {
    return this.http.get(`${this.apiUrl}/preferences/`, { headers: this.getAuthHeaders() });
  }

  updateNotificationPreferences(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/preferences/`, data, { headers: this.getAuthHeaders() });
  }
}
