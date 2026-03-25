import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentResponse, CreateCommentRequest, CreatePostRequest, PostListResponse, PostResponse } from '../../shared/models/post.model';
import { SubjectResponse } from '../../shared/models/subject.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private subjectsUrl = 'http://localhost:8080/api/subjects';
  private apiUrl = 'http://localhost:8080/api/posts';

  getFeed(): Observable<PostListResponse[]> {
    return this.http.get<PostListResponse[]>(`${this.apiUrl}/feed`);
  }

  getPostbyId(id: number): Observable<PostListResponse> {
    return this.http.get<PostListResponse>(`${this.apiUrl}/${id}`);
  } 
  getById(id: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.apiUrl}/${id}`);
  }
   createPost(request: CreatePostRequest): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.apiUrl, request);
  }
  getSubjects(): Observable<SubjectResponse[]> {
    return this.http.get<SubjectResponse[]>(this.subjectsUrl);
  }
   getComments(postId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`${this.apiUrl}/${postId}/comments`);
  }

  createComment(postId: number, request: CreateCommentRequest): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(`${this.apiUrl}/${postId}/comments`, request);
  }
}