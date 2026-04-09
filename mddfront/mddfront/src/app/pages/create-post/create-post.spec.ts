import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CreatePost } from './create-post';
import { PostService } from '../../core/services/post';
import { Auth } from '../../core/services/auth';
import { SubjectResponse } from '../../shared/models/subject.model';
import { PostResponse } from '../../shared/models/post.model';

const mockSubjects: SubjectResponse[] = [
  { id: 1, title: 'Angular', description: 'Frontend framework' },
  { id: 2, title: 'Spring', description: 'Backend framework' }
];

const mockPost: PostResponse = {
  id: 42,
  title: 'My Post',
  content: 'Some content here',
  authorUsername: 'JohnDoe',
  authorId: 1,
  subjectId: 1,
  subjectName: 'Angular',
  creationDate: ''
};

describe('CreatePost', () => {
  let component: CreatePost;
  let router: Router;

  const postServiceMock = {
    getSubjects: jest.fn(),
    createPost: jest.fn()
  };

  const authMock = {
    logout: jest.fn(),
    isAuthenticated: jest.fn().mockReturnValue(true)
  };

  beforeEach(() => {
    postServiceMock.getSubjects.mockReturnValue(of(mockSubjects));
    postServiceMock.createPost.mockReturnValue(of(mockPost));

    TestBed.configureTestingModule({
      imports: [CreatePost],
      providers: [
        provideRouter([]),
        { provide: PostService, useValue: postServiceMock },
        { provide: Auth, useValue: authMock }
      ]
    });

    const fixture = TestBed.createComponent(CreatePost);
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
  // ngOnInit()
  // -------------------------------------------------------

  describe('ngOnInit', () => {
    it('should load subjects on init', () => {
      postServiceMock.getSubjects.mockReturnValue(of(mockSubjects));

      component.ngOnInit();

      expect(postServiceMock.getSubjects).toHaveBeenCalledTimes(1);
      expect(component.subjects).toEqual(mockSubjects);
    });

    it('should log error if getSubjects fails', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      postServiceMock.getSubjects.mockReturnValue(throwError(() => new Error('Network error')));

      component.ngOnInit();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load subjects', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------
  // postForm validation
  // -------------------------------------------------------

  describe('postForm', () => {
    it('should be invalid when empty', () => {
      expect(component.postForm.invalid).toBe(true);
    });

    it('should be valid with all fields correctly filled', () => {
      component.postForm.setValue({
        title: 'Valid Title',
        subjectId: '1',
        content: 'Valid content with enough characters'
      });

      expect(component.postForm.valid).toBe(true);
    });

    it('should be invalid if title is too short', () => {
      component.postForm.setValue({
        title: 'ab',
        subjectId: '1',
        content: 'Valid content here'
      });

      expect(component.postForm.get('title')?.hasError('minlength')).toBe(true);
    });

    it('should be invalid if content is too short', () => {
      component.postForm.setValue({
        title: 'Valid Title',
        subjectId: '1',
        content: 'short'
      });

      expect(component.postForm.get('content')?.hasError('minlength')).toBe(true);
    });

    it('should be invalid if subjectId is missing', () => {
      component.postForm.setValue({
        title: 'Valid Title',
        subjectId: '',
        content: 'Valid content here'
      });

      expect(component.postForm.get('subjectId')?.hasError('required')).toBe(true);
    });
  });

  // -------------------------------------------------------
  // hasError()
  // -------------------------------------------------------

  describe('hasError', () => {
    it('should return false if field is not touched', () => {
      expect(component.hasError('title', 'required')).toBe(false);
    });

    it('should return true if field is touched and has error', () => {
      const titleControl = component.postForm.get('title');
      titleControl?.markAsTouched();

      expect(component.hasError('title', 'required')).toBe(true);
    });

    it('should return false if field is touched but has no error', () => {
      component.postForm.get('title')?.setValue('Valid Title');
      component.postForm.get('title')?.markAsTouched();

      expect(component.hasError('title', 'required')).toBe(false);
    });
  });

  // -------------------------------------------------------
  // onSubmit()
  // -------------------------------------------------------

  describe('onSubmit', () => {
    it('should not call createPost if form is invalid', () => {
      component.onSubmit();

      expect(postServiceMock.createPost).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched if form is invalid', () => {
      component.onSubmit();

      expect(component.postForm.get('title')?.touched).toBe(true);
      expect(component.postForm.get('subjectId')?.touched).toBe(true);
      expect(component.postForm.get('content')?.touched).toBe(true);
    });

    it('should call createPost with correct data on valid submit', () => {
      postServiceMock.createPost.mockReturnValue(of(mockPost));

      component.postForm.setValue({
        title: 'My Post',
        subjectId: '1',
        content: 'Some content here that is long enough'
      });

      component.onSubmit();

      expect(postServiceMock.createPost).toHaveBeenCalledWith({
        title: 'My Post',
        content: 'Some content here that is long enough',
        subjectId: 1
      });
    });

    it('should navigate to post page on success', () => {
      postServiceMock.createPost.mockReturnValue(of(mockPost));

      component.postForm.setValue({
        title: 'My Post',
        subjectId: '1',
        content: 'Some content here that is long enough'
      });

      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/posts', mockPost.id]);
    });

    it('should set errorMessage on failure', () => {
      postServiceMock.createPost.mockReturnValue(throwError(() => new Error('Server error')));

      component.postForm.setValue({
        title: 'My Post',
        subjectId: '1',
        content: 'Some content here that is long enough'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe("Erreur lors de la création de l'article");
    });

    it('should set loading to false on failure', () => {
      postServiceMock.createPost.mockReturnValue(throwError(() => new Error('Server error')));

      component.postForm.setValue({
        title: 'My Post',
        subjectId: '1',
        content: 'Some content here that is long enough'
      });

      component.onSubmit();

      expect(component.loading).toBe(false);
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

    it('should navigate to /feed exactly once', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });
  });
});