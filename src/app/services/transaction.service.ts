import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://127.0.0.1:8000/api/transaction'; 
  private baseUrl2 = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getCategoryExpenses(period: string = 'current-month', category?: string): Observable<any> {
  let url = `${this.baseUrl}/category-expenses/?period=${period}`;
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

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl2}/categories/`);
  }

  getLatestTransactions(): Observable<any[]> {
  return this.http.get<any[]>('http://127.0.0.1:8000/api/transaction/latest/');
  }
}