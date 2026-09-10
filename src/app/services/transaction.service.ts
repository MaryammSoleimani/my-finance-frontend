import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://127.0.0.1:8000/api/transaction';
  private baseUrl2 = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getCategoryExpenses(
    period: string = 'current-month',
    category?: string
  ): Observable<any> {
    let url = `${this.baseUrl}/category-expenses/?period=${period}`;

    if (category) {
      url += `&category=${category}`;
    }

    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    });
  }

  getCategoryDeposits(
    period: string = 'current-month',
    category?: string
  ): Observable<any> {
    let url = `${this.baseUrl}/category-deposits/?period=${period}`;

    if (category) {
      url += `&category=${category}`;
    }

    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    });
  }

  getDailyExpenses(
    period: string = 'current-month',
    category?: string
  ): Observable<any> {
    let url = `${this.baseUrl}/daily-expenses/?period=${period}`;

    if (category) {
      url += `&category=${category}`;
    }

    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    });
  }

  getDailyDeposits(
    period: string = 'current-month',
    category?: string
  ): Observable<any> {
    let url = `${this.baseUrl}/daily-deposits/?period=${period}`;

    if (category) {
      url += `&category=${category}`;
    }

    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    });
  }

  getGroupedTransactions(
    period: string = 'current-month',
    category?: string
  ): Observable<any> {
    let url = `${this.baseUrl}/grouped/?period=${period}`;

    if (category) {
      url += `&category=${category}`;
    }

    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/categories/`,
      { headers: this.getAuthHeaders() }
    );
  }

  getLatestTransactions(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/latest/`,
      { headers: this.getAuthHeaders() }
    );
  }

  getTransactionYears(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/years/`,
      { headers: this.getAuthHeaders() }
    );
  }

  createTransaction(transaction: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/`,
      transaction,
      { headers: this.getAuthHeaders() }
    );
  }

  updateTransaction(
    id: number,
    transaction: any
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${id}/`,
      transaction,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${id}/`,
      { headers: this.getAuthHeaders() }
    );
  }

  // CSV Import
  importCsv(
    file: File,
    account: number,
    expenseCategory: number,
    incomeCategory: number
  ): Observable<any> {
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();

    formData.append('file', file);
    formData.append('account', account.toString());
    formData.append(
      'expense_category',
      expenseCategory.toString()
    );
    formData.append(
      'income_category',
      incomeCategory.toString()
    );

    return this.http.post<any>(
      `${this.baseUrl}/import-csv/`,
      formData,
      { headers }
    );
  }
}
