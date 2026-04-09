import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Profile } from './profile';
import { UserService } from '../../core/services/user';
import { SubjectService } from '../../core/services/subject';
import { Auth } from '../../core/services/auth';
import { UserResponse } from '../../shared/models/user.model';

const mockUser: UserResponse = {
  id: 1,
  username: 'JohnDoe',
  email: 'john@doe.com',
  subscriptions: [
    { id: 1, title: 'Angular', description: 'Frontend framework' },
    { id: 2, title: 'Spring', description: 'Backend framework' }
  ]
};

const mockUpdatedUser: UserResponse = {
  ...mockUser,
  username: 'JohnUpdated',
  email: 'updated@doe.com'
};

describe('Profile', () => {
  let component: Profile;

  const userServiceMock = {
    getMe: jest.fn(),
    updateMe: jest.fn()
  };

  const subjectServiceMock = {
    unsubscribe: jest.fn()
  };

  const authMock = {
    logout: jest.fn(),
    isAuthenticated: jest.fn().mockReturnValue(true)
  };

  beforeEach(() => {
    userServiceMock.getMe.mockReturnValue(of(mockUser));
    userServiceMock.updateMe.mockReturnValue(of(mockUpdatedUser));
    subjectServiceMock.unsubscribe.mockReturnValue(of({}));

    TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
        { provide: SubjectService, useValue: subjectServiceMock },
        { provide: Auth, useValue: authMock }
      ]
    });

    const fixture = TestBed.createComponent(Profile);
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

  it('should initialize with loading true, empty messages and saving false', () => {
    component.loading = true;
    component.saving = false;
    component.successMessage = '';
    component.errorMessage = '';

    expect(component.loading).toBe(true);
    expect(component.saving).toBe(false);
    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe('');
  });

  // -------------------------------------------------------
  // loadUser()
  // -------------------------------------------------------

  describe('loadUser', () => {
    it('should call getMe once', () => {
      userServiceMock.getMe.mockReturnValue(of(mockUser));

      component.loadUser();

      expect(userServiceMock.getMe).toHaveBeenCalledTimes(1);
    });

    it('should set user on success', () => {
      userServiceMock.getMe.mockReturnValue(of(mockUser));

      component.loadUser();

      expect(component.user).toEqual(mockUser);
    });

    it('should patch form with user data on success', () => {
      userServiceMock.getMe.mockReturnValue(of(mockUser));

      component.loadUser();

      expect(component.profileForm.get('username')?.value).toBe(mockUser.username);
      expect(component.profileForm.get('email')?.value).toBe(mockUser.email);
    });

    it('should set loading to false on success', () => {
      userServiceMock.getMe.mockReturnValue(of(mockUser));

      component.loadUser();

      expect(component.loading).toBe(false);
    });

    it('should set errorMessage on failure', () => {
      userServiceMock.getMe.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadUser();

      expect(component.errorMessage).toBe('Impossible de charger le profil');
    });

    it('should set loading to false on failure', () => {
      userServiceMock.getMe.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadUser();

      expect(component.loading).toBe(false);
    });

    it('should log error on failure', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      userServiceMock.getMe.mockReturnValue(throwError(() => new Error('Network error')));

      component.loadUser();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load profile', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------
  // profileForm validation
  // -------------------------------------------------------

  describe('profileForm', () => {
    it('should be valid with required fields correctly filled', () => {
      component.profileForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: ''
      });

      expect(component.profileForm.valid).toBe(true);
    });

    it('should be invalid if username is too short', () => {
      component.profileForm.setValue({
        username: 'ab',
        email: 'john@doe.com',
        password: ''
      });

      expect(component.profileForm.get('username')?.hasError('minlength')).toBe(true);
    });

    it('should be invalid if email format is wrong', () => {
      component.profileForm.setValue({
        username: 'JohnDoe',
        email: 'not-an-email',
        password: ''
      });

      expect(component.profileForm.get('email')?.hasError('email')).toBe(true);
    });

    it('should be invalid if password is provided but too short', () => {
      component.profileForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'short'
      });

      expect(component.profileForm.get('password')?.hasError('minlength')).toBe(true);
    });

    it('should be valid if password is empty (optional field)', () => {
      component.profileForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: ''
      });

      expect(component.profileForm.valid).toBe(true);
    });
  });

  // -------------------------------------------------------
  // hasError()
  // -------------------------------------------------------

  describe('hasError', () => {
    it('should return false if field is not touched', () => {
      expect(component.hasError('username', 'required')).toBe(false);
    });

    it('should return false if field is touched but valid', () => {
      component.profileForm.get('username')?.setValue('JohnDoe');
      component.profileForm.get('username')?.markAsTouched();

      expect(component.hasError('username', 'required')).toBe(false);
    });
  });

  // -------------------------------------------------------
  // onSubmit()
  // -------------------------------------------------------

  describe('onSubmit', () => {
    it('should not call updateMe if form is invalid', () => {
      component.profileForm.setValue({ username: '', email: '', password: '' });

      component.onSubmit();

      expect(userServiceMock.updateMe).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched if form is invalid', () => {
      component.profileForm.setValue({ username: '', email: '', password: '' });

      component.onSubmit();

      expect(component.profileForm.get('username')?.touched).toBe(true);
      expect(component.profileForm.get('email')?.touched).toBe(true);
    });

    it('should call updateMe without password if password is empty', () => {
      userServiceMock.updateMe.mockReturnValue(of(mockUpdatedUser));
      component.profileForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: ''
      });

      component.onSubmit();

      expect(userServiceMock.updateMe).toHaveBeenCalledWith({
        username: 'JohnDoe',
        email: 'john@doe.com'
      });
    });

    it('should call updateMe with password if password is provided', () => {
      userServiceMock.updateMe.mockReturnValue(of(mockUpdatedUser));
      component.profileForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'newpassword123'
      });

      component.onSubmit();

      expect(userServiceMock.updateMe).toHaveBeenCalledWith({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'newpassword123'
      });
    });

    it('should set successMessage on success', () => {
      userServiceMock.updateMe.mockReturnValue(of(mockUpdatedUser));
      component.profileForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: ''
      });

      component.onSubmit();

      expect(component.successMessage).toBe('Profil mis à jour avec succès');
    });

    it('should update user on success', () => {
      userServiceMock.updateMe.mockReturnValue(of(mockUpdatedUser));
      component.profileForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: ''
      });

      component.onSubmit();

      expect(component.user).toEqual(mockUpdatedUser);
    });

    it('should set saving to false on success', () => {
      userServiceMock.updateMe.mockReturnValue(of(mockUpdatedUser));
      component.profileForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: ''
      });

      component.onSubmit();

      expect(component.saving).toBe(false);
    });

    it('should set errorMessage on failure', () => {
      userServiceMock.updateMe.mockReturnValue(throwError(() => new Error('Server error')));
      component.profileForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: ''
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Erreur lors de la mise à jour');
    });

    it('should set saving to false on failure', () => {
      userServiceMock.updateMe.mockReturnValue(throwError(() => new Error('Server error')));
      component.profileForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: ''
      });

      component.onSubmit();

      expect(component.saving).toBe(false);
    });
  });

  // -------------------------------------------------------
  // unsubscribe()
  // -------------------------------------------------------

  describe('unsubscribe', () => {
    it('should call subjectService.unsubscribe with the correct id', () => {
      subjectServiceMock.unsubscribe.mockReturnValue(of({}));
      userServiceMock.getMe.mockReturnValue(of(mockUser));

      component.unsubscribe(1);

      expect(subjectServiceMock.unsubscribe).toHaveBeenCalledWith(1);
    });

    it('should set successMessage on success', () => {
      subjectServiceMock.unsubscribe.mockReturnValue(of({}));
      userServiceMock.getMe.mockReturnValue(of(mockUser));

      component.unsubscribe(1);

      expect(component.successMessage).toBe('Désabonné avec succès !');
    });

    it('should clear errorMessage on success', () => {
      subjectServiceMock.unsubscribe.mockReturnValue(of({}));
      userServiceMock.getMe.mockReturnValue(of(mockUser));
      component.errorMessage = 'some previous error';

      component.unsubscribe(1);

      expect(component.errorMessage).toBe('');
    });

    it('should call loadUser to refresh data on success', () => {
      subjectServiceMock.unsubscribe.mockReturnValue(of({}));
      userServiceMock.getMe.mockReturnValue(of(mockUser));

      component.unsubscribe(1);

      expect(userServiceMock.getMe).toHaveBeenCalledTimes(1);
    });

    it('should set errorMessage on failure', () => {
      subjectServiceMock.unsubscribe.mockReturnValue(throwError(() => new Error('Server error')));

      component.unsubscribe(1);

      expect(component.errorMessage).toBe('Erreur lors du désabonnement.');
    });

    it('should log error on failure', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      subjectServiceMock.unsubscribe.mockReturnValue(throwError(() => new Error('Server error')));

      component.unsubscribe(1);

      expect(consoleSpy).toHaveBeenCalledWith('Unsubscribe failed', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});