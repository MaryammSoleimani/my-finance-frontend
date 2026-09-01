import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private apiUrl = 'http://127.0.0.1:8000/api/assistant/';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  sendMessage(message: string): Observable<any> {
    return this.http.post(this.apiUrl, { message }, { headers: this.getAuthHeaders() });
  }
}
