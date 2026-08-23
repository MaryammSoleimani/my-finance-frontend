import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlansService {
  private apiUrl = 'http://127.0.0.1:8000/api/plans/';

  constructor(private http: HttpClient) {
  }

  getAssets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}assets/`);
  }

  addAsset(asset: any): Observable<any> {
    return this.http.post(`${this.apiUrl}assets/`, asset);
  }

  updateAsset(id: number, asset: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/assets/${id}`, asset);
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

  // ===== Import from Accounts =====
  import_from_accounts(): Observable<any> {
    return this.http.post(`${this.apiUrl}/assets/import`, {});
  }

  getAvailableAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/accounts/available`);
  }

  importSelectedAccounts(accountIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/assets/import-selected`, { account_ids: accountIds });
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




//Events
  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events`);
  }

  addEvent(event: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events`, event);
  }

  updateEvent(id: number, event: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/events/${id}`, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${id}`);
  }
}
