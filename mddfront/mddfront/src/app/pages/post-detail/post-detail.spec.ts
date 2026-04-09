import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PostDetail } from './post-detail';
import { PostService } from '../../core/services/post';
import { Auth } from '../../core/services/auth';
import { PostResponse, CommentResponse } from '../../shared/models/post.model';

const mockComment: CommentResponse = {
  id: 1,
  content: 'Great post!',
  author: 'JaneDoe',
  creationDate: '2024-01-01T10:00:00'
};

const mockPost: PostResponse = {
  id: 1,
  title: 'Test Post',
  content: 'Test content',
  authorUsername: 'JohnDoe',
  authorId: 1,
  subjectId: 1,
  subjectName: 'Angular',
  creationDate: '2024-01-01T10:00:00',
  comments: []
};

describe('PostDetail', () => {
  let component: PostDetail;
  let router: Router;

  const postServiceMock = {
    getById: jest.fn(),
    createComment: jest.fn()
  };

  const authMock = {
    logout: jest.fn(),
    isAuthenticated: jest.fn().mockReturnValue(true)
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1')
      }
    }
  };

  beforeEach(() => {
    postServiceMock.getById.mockReturnValue(of(mockPost));
    postServiceMock.createComment.mockReturnValue(of(mockComment));

    TestBed.configureTestingModule({
      imports: [PostDetail],
      providers: [
        provideRouter([]),
        { provide: PostService, useValue: postServiceMock },
        { provide: Auth, useValue: authMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    });

    const fixture = TestBed.createComponent(PostDetail);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();

    jest.clearAllMocks();
  });

  // -------------------------------------------------------
  // BASIC
  // -------------------------------------------------------

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading true and empty errorMessage', () => {
    // Reset state to check initial values before detectChanges
    component.loading = true;
    component.errorMessage = '';

    expect(component.loading).toBe(true);
    expect(component.errorMessage).toBe('');
  });

  // -------------------------------------------------------
  // ngOnInit() / loadPost()
  // -------------------------------------------------------

  describe('loadPost', () => {
    it('should call getById with the route id', () => {
      postServiceMock.getById.mockReturnValue(of(mockPost));

      component.loadPost(1);

      expect(postServiceMock.getById).toHaveBeenCalledWith(1);
    });

    it('should set post on success', () => {
      postServiceMock.getById.mockReturnValue(of(mockPost));

      component.loadPost(1);

      expect(component.post).toEqual(mockPost);
    });

    it('should set loading to false on success', () => {
      postServiceMock.getById.mockReturnValue(of(mockPost));

      component.loadPost(1);

      expect(component.loading).toBe(false);
    });

    it('should set errorMessage on failure', () => {
      postServiceMock.getById.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadPost(1);

      expect(component.errorMessage).toBe("Impossible de charger l'article");
    });

    it('should set loading to false on failure', () => {
      postServiceMock.getById.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadPost(1);

      expect(component.loading).toBe(false);
    });

    it('should log error on failure', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      postServiceMock.getById.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadPost(1);

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load post', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------
  // commentForm validation
  // -------------------------------------------------------

  describe('commentForm', () => {
    it('should be invalid when empty', () => {
      expect(component.commentForm.invalid).toBe(true);
    });

    it('should be valid with content filled', () => {
      component.commentForm.setValue({ content: 'A valid comment' });

      expect(component.commentForm.valid).toBe(true);
    });

    it('should be invalid if content is empty', () => {
      component.commentForm.setValue({ content: '' });

      expect(component.commentForm.get('content')?.hasError('required')).toBe(true);
    });
  });

  // -------------------------------------------------------
  // submitComment()
  // -------------------------------------------------------

  describe('submitComment', () => {
    beforeEach(() => {
      component.post = { ...mockPost, comments: [] };
    });

    it('should not call createComment if form is invalid', () => {
      component.submitComment();

      expect(postServiceMock.createComment).not.toHaveBeenCalled();
    });

    it('should not call createComment if post is null', () => {
      component.post = null;
      component.commentForm.setValue({ content: 'A comment' });

      component.submitComment();

      expect(postServiceMock.createComment).not.toHaveBeenCalled();
    });

    it('should call createComment with post id and form value', () => {
      postServiceMock.createComment.mockReturnValue(of(mockComment));
      component.commentForm.setValue({ content: 'A comment' });

      component.submitComment();

      expect(postServiceMock.createComment).toHaveBeenCalledWith(1, { content: 'A comment' });
    });

    it('should append comment to post.comments on success', () => {
      postServiceMock.createComment.mockReturnValue(of(mockComment));
      component.commentForm.setValue({ content: 'A comment' });

      component.submitComment();

      expect(component.post!.comments).toContainEqual(mockComment);
    });

    it('should reset commentForm on success', () => {
      postServiceMock.createComment.mockReturnValue(of(mockComment));
      component.commentForm.setValue({ content: 'A comment' });

      component.submitComment();

      expect(component.commentForm.get('content')?.value).toBeNull();
    });

    it('should set submitting to false on success', () => {
      postServiceMock.createComment.mockReturnValue(of(mockComment));
      component.commentForm.setValue({ content: 'A comment' });

      component.submitComment();

      expect(component.submitting).toBe(false);
    });

    it('should set submitting to false on error', () => {
      postServiceMock.createComment.mockReturnValue(throwError(() => new Error('Server error')));
      component.commentForm.setValue({ content: 'A comment' });

      component.submitComment();

      expect(component.submitting).toBe(false);
    });

    it('should log error on failure', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      postServiceMock.createComment.mockReturnValue(throwError(() => new Error('Server error')));
      component.commentForm.setValue({ content: 'A comment' });

      component.submitComment();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to post comment', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------
  // goBack()
  // -------------------------------------------------------

  describe('goBack', () => {
    it('should navigate to /feed', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/feed']);
    });

    it('should navigate exactly once', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });
  });
});