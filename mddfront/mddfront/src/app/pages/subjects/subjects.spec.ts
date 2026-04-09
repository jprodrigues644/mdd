import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Subjects } from './subjects';
import { SubjectService } from '../../core/services/subject';
import { Auth } from '../../core/services/auth';
import { SubjectResponse } from '../../shared/models/subject.model';

const mockSubjects: SubjectResponse[] = [
  { id: 1, title: 'Angular', description: 'Frontend framework', subscribed: false },
  { id: 2, title: 'Spring', description: 'Backend framework', subscribed: true }
];

describe('Subjects', () => {
  let component: Subjects;

  const subjectServiceMock = {
    getAll: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn()
  };

  const authMock = {
    logout: jest.fn(),
    isAuthenticated: jest.fn().mockReturnValue(true)
  };

  beforeEach(() => {
    subjectServiceMock.getAll.mockReturnValue(of(mockSubjects));
    subjectServiceMock.subscribe.mockReturnValue(of({ ...mockSubjects[0], subscribed: true }));
    subjectServiceMock.unsubscribe.mockReturnValue(of({ ...mockSubjects[1], subscribed: false }));

    TestBed.configureTestingModule({
      imports: [Subjects],
      providers: [
        provideRouter([]),
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Auth, useValue: authMock }
      ]
    });

    const fixture = TestBed.createComponent(Subjects);
    component = fixture.componentInstance;

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
    component.loading = true;
    component.errorMessage = '';

    expect(component.loading).toBe(true);
    expect(component.errorMessage).toBe('');
  });

  // -------------------------------------------------------
  // loadSubjects()
  // -------------------------------------------------------

  describe('loadSubjects', () => {
    it('should call getAll once', () => {
      subjectServiceMock.getAll.mockReturnValue(of(mockSubjects));

      component.loadSubjects();

      expect(subjectServiceMock.getAll).toHaveBeenCalledTimes(1);
    });

    it('should populate subjects on success', () => {
      subjectServiceMock.getAll.mockReturnValue(of(mockSubjects));

      component.loadSubjects();

      expect(component.subjects).toEqual(mockSubjects);
    });

    it('should set loading to false on success', () => {
      subjectServiceMock.getAll.mockReturnValue(of(mockSubjects));

      component.loadSubjects();

      expect(component.loading).toBe(false);
    });

    it('should set errorMessage on failure', () => {
      subjectServiceMock.getAll.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadSubjects();

      expect(component.errorMessage).toBe('Impossible de charger les thèmes');
    });

    it('should set loading to false on failure', () => {
      subjectServiceMock.getAll.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadSubjects();

      expect(component.loading).toBe(false);
    });

    it('should log error on failure', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      subjectServiceMock.getAll.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadSubjects();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load subjects', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------
  // toggleSubscription()
  // -------------------------------------------------------

  describe('toggleSubscription', () => {
    it('should call unsubscribe if subject is subscribed', () => {
      const subscribedSubject: SubjectResponse = { ...mockSubjects[1] }; // subscribed: true

      component.toggleSubscription(subscribedSubject);

      expect(subjectServiceMock.unsubscribe).toHaveBeenCalledWith(subscribedSubject.id);
      expect(subjectServiceMock.subscribe).not.toHaveBeenCalled();
    });

    it('should call subscribe if subject is not subscribed', () => {
      const unsubscribedSubject: SubjectResponse = { ...mockSubjects[0] }; // subscribed: false

      component.toggleSubscription(unsubscribedSubject);

      expect(subjectServiceMock.subscribe).toHaveBeenCalledWith(unsubscribedSubject.id);
      expect(subjectServiceMock.unsubscribe).not.toHaveBeenCalled();
    });

    it('should toggle subscribed to true when was false', () => {
      const subject: SubjectResponse = { ...mockSubjects[0], subscribed: false };
      subjectServiceMock.subscribe.mockReturnValue(of({ ...subject, subscribed: true }));

      component.toggleSubscription(subject);

      expect(subject.subscribed).toBe(true);
    });

    it('should toggle subscribed to false when was true', () => {
      const subject: SubjectResponse = { ...mockSubjects[1], subscribed: true };
      subjectServiceMock.unsubscribe.mockReturnValue(of({ ...subject, subscribed: false }));

      component.toggleSubscription(subject);

      expect(subject.subscribed).toBe(false);
    });

    it('should log error if subscribe fails', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      subjectServiceMock.subscribe.mockReturnValue(throwError(() => new Error('Server error')));
      const subject: SubjectResponse = { ...mockSubjects[0], subscribed: false };

      component.toggleSubscription(subject);

      expect(consoleSpy).toHaveBeenCalledWith('Subscription action failed', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should log error if unsubscribe fails', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      subjectServiceMock.unsubscribe.mockReturnValue(throwError(() => new Error('Server error')));
      const subject: SubjectResponse = { ...mockSubjects[1], subscribed: true };

      component.toggleSubscription(subject);

      expect(consoleSpy).toHaveBeenCalledWith('Subscription action failed', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should not change subscribed state on error', () => {
      subjectServiceMock.subscribe.mockReturnValue(throwError(() => new Error('Server error')));
      const subject: SubjectResponse = { ...mockSubjects[0], subscribed: false };

      component.toggleSubscription(subject);

      expect(subject.subscribed).toBe(false);
    });
  });
});