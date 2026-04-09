import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Login } from './login';
import { Auth } from '../../core/services/auth';

describe('Login', () => {
  let component: Login;
  let router: Router;

  const authMock = {
    login: jest.fn()
  };

  beforeEach(() => {
    authMock.login.mockReturnValue(of({}));

    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: authMock }
      ]
    });

    const fixture = TestBed.createComponent(Login);
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

  it('should initialize with loading false and empty errorMessage', () => {
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  // -------------------------------------------------------
  // loginForm validation
  // -------------------------------------------------------

  describe('loginForm', () => {
    it('should be invalid when empty', () => {
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should be valid with all fields correctly filled', () => {
      component.loginForm.setValue({
        usernameOrEmail: 'john@doe.com',
        password: 'password123'
      });

      expect(component.loginForm.valid).toBe(true);
    });

    it('should be invalid if password is too short', () => {
      component.loginForm.setValue({
        usernameOrEmail: 'john@doe.com',
        password: 'short'
      });

      expect(component.loginForm.get('password')?.hasError('minlength')).toBe(true);
    });

    it('should be invalid if usernameOrEmail is missing', () => {
      component.loginForm.setValue({
        usernameOrEmail: '',
        password: 'password123'
      });

      expect(component.loginForm.get('usernameOrEmail')?.hasError('required')).toBe(true);
    });

    it('should be invalid if password is missing', () => {
      component.loginForm.setValue({
        usernameOrEmail: 'john@doe.com',
        password: ''
      });

      expect(component.loginForm.get('password')?.hasError('required')).toBe(true);
    });
  });

  // -------------------------------------------------------
  // hasError()
  // -------------------------------------------------------

  describe('hasError', () => {
    it('should return false if field is not touched', () => {
      expect(component.hasError('usernameOrEmail', 'required')).toBe(false);
    });

    it('should return true if field is touched and has error', () => {
      component.loginForm.get('usernameOrEmail')?.markAsTouched();

      expect(component.hasError('usernameOrEmail', 'required')).toBe(true);
    });

    it('should return false if field is touched but has no error', () => {
      component.loginForm.get('usernameOrEmail')?.setValue('john@doe.com');
      component.loginForm.get('usernameOrEmail')?.markAsTouched();

      expect(component.hasError('usernameOrEmail', 'required')).toBe(false);
    });
  });

  // -------------------------------------------------------
  // getErrorMessage()
  // -------------------------------------------------------

  describe('getErrorMessage', () => {
    it('should return required message when field is empty', () => {
      expect(component.getErrorMessage('usernameOrEmail')).toBe('Ce champ est obligatoire');
    });

    it('should return minlength message when password is too short', () => {
      component.loginForm.get('password')?.setValue('short');

      expect(component.getErrorMessage('password')).toBe('Minimum 8 caractères');
    });

    it('should return empty string when field is valid', () => {
      component.loginForm.get('usernameOrEmail')?.setValue('john@doe.com');

      expect(component.getErrorMessage('usernameOrEmail')).toBe('');
    });
  });

  // -------------------------------------------------------
  // onSubmit()
  // -------------------------------------------------------

  describe('onSubmit', () => {
    it('should not call auth.login if form is invalid', () => {
      component.onSubmit();

      expect(authMock.login).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched if form is invalid', () => {
      component.onSubmit();

      expect(component.loginForm.get('usernameOrEmail')?.touched).toBe(true);
      expect(component.loginForm.get('password')?.touched).toBe(true);
    });

    it('should call auth.login with form values on valid submit', () => {
      authMock.login.mockReturnValue(of({}));

      component.loginForm.setValue({
        usernameOrEmail: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(authMock.login).toHaveBeenCalledWith({
        usernameOrEmail: 'john@doe.com',
        password: 'password123'
      });
    });

    it('should set loading to false on success', () => {
      authMock.login.mockReturnValue(of({}));

      component.loginForm.setValue({
        usernameOrEmail: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.loading).toBe(false);
    });

    it('should set errorMessage for 401 error', () => {
      authMock.login.mockReturnValue(throwError(() => ({ status: 401 })));

      component.loginForm.setValue({
        usernameOrEmail: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Identifiants invalides');
    });

    it('should set errorMessage for status 0 (server unreachable)', () => {
      authMock.login.mockReturnValue(throwError(() => ({ status: 0 })));

      component.loginForm.setValue({
        usernameOrEmail: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Impossible de se connecter au serveur');
    });

    it('should set generic errorMessage for unknown error', () => {
      authMock.login.mockReturnValue(throwError(() => ({ status: 500 })));

      component.loginForm.setValue({
        usernameOrEmail: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Une erreur est survenue lors de la connexion');
    });

    it('should set loading to false on error', () => {
      authMock.login.mockReturnValue(throwError(() => ({ status: 500 })));

      component.loginForm.setValue({
        usernameOrEmail: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.loading).toBe(false);
    });
  });

  // -------------------------------------------------------
  // goBack()
  // -------------------------------------------------------

  describe('goBack', () => {
    it('should navigate to /', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should navigate exactly once', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });
  });
});