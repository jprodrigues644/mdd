import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Feed } from './feed';
import { PostService } from '../../core/services/post';
import { Auth } from '../../core/services/auth';
import { PostListResponse } from '../../shared/models/post.model';

const mockPosts: PostListResponse[] = [
  {
    id: 1,
    title: 'Post A',
    content: 'Content A',
    authorUsername: 'JohnDoe',
    authorId: 1,
    subjectId: 1,
    subjectName: 'Angular',
    creationDate: '2024-01-01T10:00:00'
  },
  {
    id: 2,
    title: 'Post B',
    content: 'Content B',
    authorUsername: 'JaneDoe',
    authorId: 2,
    subjectId: 2,
    subjectName: 'Spring',
    creationDate: '2024-03-01T10:00:00'
  },
  {
    id: 3,
    title: 'Post C',
    content: 'Content C',
    authorUsername: 'BobSmith',
    authorId: 3,
    subjectId: 1,
    subjectName: 'Angular',
    creationDate: '2024-02-01T10:00:00'
  }
];

describe('Feed', () => {
  let component: Feed;
  let router: Router;

  const postServiceMock = {
    getFeed: jest.fn()
  };

  const authMock = {
    logout: jest.fn(),
    isAuthenticated: jest.fn().mockReturnValue(true)
  };

  beforeEach(() => {
    postServiceMock.getFeed.mockReturnValue(of(mockPosts));

    TestBed.configureTestingModule({
      imports: [Feed],
      providers: [
        provideRouter([]),
        { provide: PostService, useValue: postServiceMock },
        { provide: Auth, useValue: authMock }
      ]
    });

    const fixture = TestBed.createComponent(Feed);
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

  // -------------------------------------------------------
  // ngOnInit() / loadFeed()
  // -------------------------------------------------------

  describe('loadFeed', () => {
    it('should call getFeed on init', () => {
      postServiceMock.getFeed.mockReturnValue(of(mockPosts));

      component.loadFeed();

      expect(postServiceMock.getFeed).toHaveBeenCalledTimes(1);
    });

    it('should populate posts on success', () => {
      postServiceMock.getFeed.mockReturnValue(of(mockPosts));

      component.loadFeed();

      expect(component.posts).toEqual(mockPosts);
    });

    it('should set loading to false on success', () => {
      postServiceMock.getFeed.mockReturnValue(of(mockPosts));

      component.loadFeed();

      expect(component.loading).toBe(false);
    });

    it('should set errorMessage on failure', () => {
      postServiceMock.getFeed.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadFeed();

      expect(component.errorMessage).toBe('Impossible de charger les articles');
    });

    it('should set loading to false on failure', () => {
      postServiceMock.getFeed.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadFeed();

      expect(component.loading).toBe(false);
    });

    it('should log error on failure', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      postServiceMock.getFeed.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadFeed();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load feed', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------
  // toggleSort()
  // -------------------------------------------------------

  describe('toggleSort', () => {
    beforeEach(() => {
      component.posts = [...mockPosts];
    });

    it('should toggle sortAsc from false to true', () => {
      component.sortAsc = false;

      component.toggleSort();

      expect(component.sortAsc).toBe(true);
    });

    it('should toggle sortAsc from true to false', () => {
      component.sortAsc = true;

      component.toggleSort();

      expect(component.sortAsc).toBe(false);
    });

    it('should sort posts ascending by creationDate when sortAsc is true', () => {
      component.sortAsc = false;

      component.toggleSort(); // now true

      const dates = component.posts.map(p => new Date(p.creationDate).getTime());
      expect(dates[0]).toBeLessThanOrEqual(dates[1]);
      expect(dates[1]).toBeLessThanOrEqual(dates[2]);
    });

    it('should sort posts descending by creationDate when sortAsc is false', () => {
      component.sortAsc = true;

      component.toggleSort(); // now false

      const dates = component.posts.map(p => new Date(p.creationDate).getTime());
      expect(dates[0]).toBeGreaterThanOrEqual(dates[1]);
      expect(dates[1]).toBeGreaterThanOrEqual(dates[2]);
    });

    it('should not mutate the original array reference', () => {
      const originalRef = component.posts;

      component.toggleSort();

      expect(component.posts).not.toBe(originalRef);
    });
  });

  // -------------------------------------------------------
  // goToPost()
  // -------------------------------------------------------

  describe('goToPost', () => {
    it('should navigate to /posts/:id', () => {
      component.goToPost(1);

      expect(router.navigate).toHaveBeenCalledWith(['/posts', 1]);
    });

    it('should navigate with the correct id', () => {
      component.goToPost(99);

      expect(router.navigate).toHaveBeenCalledWith(['/posts', 99]);
    });

    it('should navigate exactly once', () => {
      component.goToPost(1);

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------
  // goToCreatePost()
  // -------------------------------------------------------

  describe('goToCreatePost', () => {
    it('should navigate to /create-post', () => {
      component.goToCreatePost();

      expect(router.navigate).toHaveBeenCalledWith(['/create-post']);
    });

    it('should navigate exactly once', () => {
      component.goToCreatePost();

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });
  });
});