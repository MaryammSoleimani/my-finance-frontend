import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = 'http://127.0.0.1:8000/api/budget';
  private categoriesUrl = 'http://127.0.0.1:8000/api/categories';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getBudgets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`, { headers: this.getAuthHeaders() });
  }

  getSummary(period: string = 'monthly'): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary/?period=${period}`, { headers: this.getAuthHeaders() });
  }

  createBudget(budgetData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/`, budgetData, { headers: this.getAuthHeaders() });
  }

  updateBudget(id: number, budgetData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/`, budgetData, { headers: this.getAuthHeaders() });
  }

  deleteBudget(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/`, { headers: this.getAuthHeaders() });
  }


  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.categoriesUrl}/`, { headers: this.getAuthHeaders() });
  }
}
