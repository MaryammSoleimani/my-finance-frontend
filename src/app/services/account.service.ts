import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccountSummaryData {
  net_worth: number;
  total_assets: number;
  total_liabilities: number;
  assets: any[];
  liabilities: any[];
  chart_data: {
    series: { name: string; data: number[]; color: string }[];
    dates: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://127.0.0.1:8000/api/accounts/';

  constructor(private http: HttpClient) { }

  getAccountSummary(period: string = '1m'): Observable<AccountSummaryData> {
    return this.http.get<AccountSummaryData>(`${this.apiUrl}summary/?period=${period}`);
  }

  createAccount(accountData: any): Observable<any> {
    return this.http.post(this.apiUrl, accountData);
  }

  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  getAccounts() {
    return this.http.get<any>(`${this.apiUrl}/summary/`);
  }

}