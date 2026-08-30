import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://127.0.0.1:8000/api/analytics';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getHealthScore(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health-score/`, { headers: this.getAuthHeaders() });
  }

  getAnomalyAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/anomaly-detection/`, { headers: this.getAuthHeaders() });
  }

  calculateSmartGoal(goalAmount: number, months: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/smart-goal/`, { goal_amount: goalAmount, months }, { headers: this.getAuthHeaders() });
  }
}
