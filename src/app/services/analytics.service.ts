import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface AnomalyAlertData {
  id: number;
  category: number;
  category_name: string;
  month: string;
  expected_amount: number;
  expected_amount_toman: number;  // ← اضافه شد
  actual_amount: number;
  actual_amount_toman: number;  // ← اضافه شد
  deviation_percentage: number;
  created_at_shamsi: string;  // ← اضافه شد
}

export interface HealthScoreData {
  score: number;
  grade: string;
  last_calculated_shamsi: string;  // ← اضافه شد
}
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
