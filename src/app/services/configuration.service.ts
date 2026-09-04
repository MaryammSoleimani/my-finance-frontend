// src/app/services/configuration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private categoriesUrl = 'http://127.0.0.1:8000/api/categories';
  private notificationsUrl = 'http://127.0.0.1:8000/api/notifications';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ==========================================
  // Categories API
  // ==========================================

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.categoriesUrl}/`, { headers: this.getAuthHeaders() });
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.categoriesUrl}/`, categoryData, { headers: this.getAuthHeaders() });
  }

  updateCategory(id: number, categoryData: any): Observable<any> {
    return this.http.put(`${this.categoriesUrl}/${id}/`, categoryData, { headers: this.getAuthHeaders() });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.categoriesUrl}/${id}/`, { headers: this.getAuthHeaders() });
  }

  getCategoryUsage(id: number): Observable<any> {
    return this.http.get(`${this.categoriesUrl}/${id}/usage_count/`, {headers: this.getAuthHeaders()});
}
  // ==========================================
  // Notifications API
  // ==========================================

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.notificationsUrl}/`, { headers: this.getAuthHeaders() });
  }

  getNotificationPreferences(): Observable<any> {
    return this.http.get(`${this.notificationsUrl}/preferences/`, { headers: this.getAuthHeaders() });
  }

  updateNotificationPreferences(preferences: any): Observable<any> {
    return this.http.put(`${this.notificationsUrl}/preferences/`, preferences, { headers: this.getAuthHeaders() });
  }

  updateNotification(id: number, data: any): Observable<any> {
    return this.http.put(`${this.notificationsUrl}/${id}/`, data, { headers: this.getAuthHeaders() });
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${this.notificationsUrl}/read-all/`, {}, { headers: this.getAuthHeaders() });
  }
}
