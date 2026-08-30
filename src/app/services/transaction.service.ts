import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://127.0.0.1:8000/api/transaction';
  private baseUrl2 = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

   private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getCategoryExpenses(period: string = 'current-month', category?: string): Observable<any> {
    let url = `${this.baseUrl}/category-expenses/?period=${period}`;
    if (category) {
      url += `&category=${category}`;
    }
    return this.http.get<any>(url);
  }

  getCategoryDeposits(period: string = 'current-month', category?: string): Observable<any> {
    let url = `${this.baseUrl}/category-deposits/?period=${period}`;
    if (category) {
      url += `&category=${category}`;
    }
    return this.http.get<any>(url);
  }

  getDailyExpenses(period: string = 'current-month', category?: string): Observable<any> {
    let url = `${this.baseUrl}/daily-expenses/?period=${period}`;
    if (category) {
      url += `&category=${category}`;
    }
    return this.http.get<any>(url);
  }

  getGroupedTransactions(period: string = 'current-month', category?: string): Observable<any> {
    let url = `${this.baseUrl}/grouped/?period=${period}`;
    if (category) {
      url += `&category=${category}`;
    }
    return this.http.get<any>(url);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories/`);
  }

  getLatestTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/latest/`);
  }

  getTransactionYears(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/years/`);
  }

  createTransaction(transaction: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, transaction);
  }

  updateTransaction(id: number, transaction: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/`, transaction);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/`);
  }
}
