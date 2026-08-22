import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = 'http://localhost:8000/api/budget/status/';

  constructor(private http: HttpClient) {}

  getBudgetStatus(month: number, year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?month=${month}&year=${year}`);
  }
}