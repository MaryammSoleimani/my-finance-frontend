import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlansService {
  private apiUrl = 'http://127.0.0.1:8000/api/plans';

  constructor(private http: HttpClient) {
  }

  // ==========================================
  // Assets CRUD
  // ==========================================
  getAssets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assets/`);
  }

  addAsset(asset: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assets/`, asset);
  }

  updateAsset(id: number, asset: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/assets/${id}/`, asset);
  }

  deleteAsset(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/assets/${id}/`);
  }

  // ==========================================
  // Import from Accounts
  // ==========================================
  import_from_accounts(): Observable<any> {
    return this.http.post(`${this.apiUrl}/assets/import_from_accounts/`, {});
  }

  getAvailableAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assets/available_accounts/`);
  }

  importSelectedAccounts(accountIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/assets/import_selected/`, { account_ids: accountIds });
  }

  // ==========================================
  // Cash Flows CRUD
  // ==========================================
  getCashFlows(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cash-flows/`);
  }

  addCashFlow(flow: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cash-flows/`, flow);
  }

  updateCashFlow(id: number, flow: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cash-flows/${id}/`, flow);
  }

  deleteCashFlow(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cash-flows/${id}/`);
  }

  // ==========================================
  // Events CRUD
  // ==========================================
  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events/`);
  }

  addEvent(event: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/`, event);
  }

  updateEvent(id: number, event: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/events/${id}/`, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${id}/`);
  }

  // ==========================================
  // Simulation APIs
  // ==========================================
  getSimulationSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/simulation/summary/`);
  }

  getFinancialTimeline(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/simulation/timeline/`);
  }

  getSimulationSteps(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/simulation/steps/`);
  }

  // ==========================================
  // Simulation Settings
  // ==========================================
  getSimulationSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/simulation/settings/`);
  }

  updateSimulationSettings(settings: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/simulation/settings/`, settings);
  }

  runSimulation(): Observable<any> {
  return this.http.post(`${this.apiUrl}/simulation/run/`, {});
}

  // ==========================================
  // Progress Snapshots
  // ==========================================
  getSnapshots(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/snapshots/`);
  }

  takeSnapshot(): Observable<any> {
    return this.http.post(`${this.apiUrl}/snapshots/`, {});
  }

  deleteSnapshot(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/snapshots/${id}/`);
  }
}
