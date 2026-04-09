import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Register } from './register';
import { Auth } from '../../core/services/auth';

describe('Register', () => {
  let component: Register;
  let router: Router;

  const authMock = {
    register: jest.fn()
  };

  beforeEach(() => {
    authMock.register.mockReturnValue(of({}));

    TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: authMock }
      ]
    });

    const fixture = TestBed.createComponent(Register);
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
  // registerForm validation
  // -------------------------------------------------------

  describe('registerForm', () => {
    it('should be invalid when empty', () => {
      expect(component.registerForm.invalid).toBe(true);
    });

    it('should be valid with all fields correctly filled', () => {
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password123'
      });

      expect(component.registerForm.valid).toBe(true);
    });

    it('should be invalid if username is too short', () => {
      component.registerForm.setValue({
        username: 'ab',
        email: 'john@doe.com',
        password: 'password123'
      });

      expect(component.registerForm.get('username')?.hasError('minlength')).toBe(true);
    });

    it('should be invalid if email format is wrong', () => {
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'not-an-email',
        password: 'password123'
      });

      expect(component.registerForm.get('email')?.hasError('email')).toBe(true);
    });

    it('should be invalid if email exceeds maxLength', () => {
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'a'.repeat(95) + '@doe.com',
        password: 'password123'
      });

      expect(component.registerForm.get('email')?.hasError('maxlength')).toBe(true);
    });

    it('should be invalid if password is too short', () => {
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'short'
      });

      expect(component.registerForm.get('password')?.hasError('minlength')).toBe(true);
    });

    it('should be invalid if username is missing', () => {
      component.registerForm.setValue({
        username: '',
        email: 'john@doe.com',
        password: 'password123'
      });

      expect(component.registerForm.get('username')?.hasError('required')).toBe(true);
    });
  });

  // -------------------------------------------------------
  // hasError()
  // -------------------------------------------------------

  describe('hasError', () => {
    it('should return false if field is not touched', () => {
      expect(component.hasError('username', 'required')).toBe(false);
    });

    it('should return true if field is touched and has error', () => {
      component.registerForm.get('username')?.markAsTouched();

      expect(component.hasError('username', 'required')).toBe(true);
    });

    it('should return false if field is touched but valid', () => {
      component.registerForm.get('username')?.setValue('JohnDoe');
      component.registerForm.get('username')?.markAsTouched();

      expect(component.hasError('username', 'required')).toBe(false);
    });
  });

  // -------------------------------------------------------
  // getErrorMessage()
  // -------------------------------------------------------

  describe('getErrorMessage', () => {
    it('should return required message when field is empty', () => {
      expect(component.getErrorMessage('username')).toBe('Ce champ est obligatoire');
    });

    it('should return minlength message when username is too short', () => {
      component.registerForm.get('username')?.setValue('ab');

      expect(component.getErrorMessage('username')).toBe('Minimum 3 caractères');
    });

    it('should return minlength message when password is too short', () => {
      component.registerForm.get('password')?.setValue('short');

      expect(component.getErrorMessage('password')).toBe('Minimum 8 caractères');
    });

    it('should return email message when email is invalid', () => {
      component.registerForm.get('email')?.setValue('not-an-email');

      expect(component.getErrorMessage('email')).toBe('Veuillez entrer une adresse email valide');
    });

    it('should return maxlength message when email is too long', () => {
      component.registerForm.get('email')?.setValue('a'.repeat(95) + '@doe.com');

      expect(component.getErrorMessage('email')).toBe('Veuillez entrer une adresse email valide');
    });

    it('should return empty string when field is valid', () => {
      component.registerForm.get('username')?.setValue('JohnDoe');

      expect(component.getErrorMessage('username')).toBe('');
    });
  });

  // -------------------------------------------------------
  // onSubmit()
  // -------------------------------------------------------

  describe('onSubmit', () => {
    it('should not call auth.register if form is invalid', () => {
      component.onSubmit();

      expect(authMock.register).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched if form is invalid', () => {
      component.onSubmit();

      expect(component.registerForm.get('username')?.touched).toBe(true);
      expect(component.registerForm.get('email')?.touched).toBe(true);
      expect(component.registerForm.get('password')?.touched).toBe(true);
    });

    it('should call auth.register with form values on valid submit', () => {
      authMock.register.mockReturnValue(of({}));
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(authMock.register).toHaveBeenCalledWith({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password123'
      });
    });

    it('should set loading to false on success', () => {
      authMock.register.mockReturnValue(of({}));
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.loading).toBe(false);
    });

    it('should set errorMessage for duplicate username (400)', () => {
      authMock.register.mockReturnValue(throwError(() => ({
        status: 400,
        error: { message: 'username already taken' }
      })));
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe("Ce nom d'utilisateur est déjà utilisé");
    });

    it('should set errorMessage for duplicate email (400)', () => {
      authMock.register.mockReturnValue(throwError(() => ({
        status: 400,
        error: { message: 'email already taken' }
      })));
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Cet email est déjà utilisé');
    });

    it('should set generic errorMessage for other 400 error', () => {
      authMock.register.mockReturnValue(throwError(() => ({
        status: 400,
        error: { message: 'other validation error' }
      })));
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Données invalides');
    });

    it('should set errorMessage for status 0 (server unreachable)', () => {
      authMock.register.mockReturnValue(throwError(() => ({ status: 0 })));
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Impossible de se connecter au serveur');
    });

    it('should set generic errorMessage for unknown error', () => {
      authMock.register.mockReturnValue(throwError(() => ({ status: 500 })));
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe("Une erreur est survenue lors de l'inscription");
    });

    it('should set loading to false on error', () => {
      authMock.register.mockReturnValue(throwError(() => ({ status: 500 })));
      component.registerForm.setValue({
        username: 'JohnDoe',
        email: 'john@doe.com',
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