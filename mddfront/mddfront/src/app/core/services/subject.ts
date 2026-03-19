import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubjectResponse } from '../../shared/models/subject.model';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/subjects';

  getAll(): Observable<SubjectResponse[]> {
    return this.http.get<SubjectResponse[]>(this.apiUrl);
  }

  subscribe(id: number): Observable<SubjectResponse> {
    return this.http.post<SubjectResponse>(`${this.apiUrl}/${id}/subscribe`, {});
  }

  unsubscribe(id: number): Observable<SubjectResponse> {
    return this.http.post<SubjectResponse>(`${this.apiUrl}/${id}/unsubscribe`, {});
  }
}