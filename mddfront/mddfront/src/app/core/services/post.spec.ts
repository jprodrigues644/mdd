import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PostService } from './post';
import { PostListResponse, PostResponse, CommentResponse, CreatePostRequest, CreateCommentRequest } from '../../shared/models/post.model';
import { SubjectResponse } from '../../shared/models/subject.model';
import { firstValueFrom } from 'rxjs';

const mockPost: PostListResponse = {
  id: 1,
  title: 'Test Post',
  content: 'Contenu du post',
  authorUsername: 'John Doe',
  authorId: 0,
  subjectId: 0,
  subjectName: '',
  creationDate: ''
};

const mockComment: CommentResponse = {
  id: 1,
  content: 'Super post!',
  author: 'Jane Doe',
  creationDate: ''
};

describe('PostService Unit Tests', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getFeed should GET posts', () => {
    service.getFeed().subscribe((posts) => {
      expect(posts).toEqual([mockPost]);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/posts/feed');
    expect(req.request.method).toBe('GET');
    req.flush([mockPost]);
  });

  it('createComment should POST comment', () => {
    const request: CreateCommentRequest = { content: 'Super post!' };
    service.createComment(1, request).subscribe((comment) => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/posts/1/comments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockComment);
  });
});

