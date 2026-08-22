import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlansService {
  private apiUrl = 'http://127.0.0.1:8000/api/plans/';

  constructor(private http: HttpClient) {}

  getAssets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}assets/`);
  }

  addAsset(asset: any): Observable<any> {
    return this.http.post(`${this.apiUrl}assets/`, asset);
  }

  deleteAsset(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}assets/${id}/`);
  }

  getData(endpoint: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${endpoint}/`);
  }

  deleteData(endpoint: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${endpoint}/${id}/`);
  }

  import_from_accounts(): Observable<any> {
    return this.http.post(`${this.apiUrl}assets/import_from_accounts/`, {});
  }

  getAvailableAccounts(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/accounts/'); 
  }

  importSelectedAccounts(accountIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}assets/import_selected/`, { account_ids: accountIds });
  }

  //cash-flow
  getCashFlows(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}cash-flow/`);
  }

  addCashFlow(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}cash-flow/`, data);
  }

  deleteCashFlow(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}cash-flow/${id}/`);
  }

  updateCashFlow(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}cash-flow/${id}/`, data);
  }

  updateAsset(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}assets/${id}/`, data);
  }
}