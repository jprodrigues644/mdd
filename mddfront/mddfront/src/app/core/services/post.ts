import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostListResponse } from '../../shared/models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/posts';

  getFeed(): Observable<PostListResponse[]> {
    return this.http.get<PostListResponse[]>(`${this.apiUrl}/feed`);
  }
}