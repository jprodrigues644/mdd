import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { Auth } from './auth';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/auth.model';

describe('Auth Service (Jest)', () => {
  let service: Auth;
  let httpMock: HttpTestingController;

  const routerMock = {
    navigate: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        Auth,
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);

    // Reset mocks
    jest.clearAllMocks();

    // Mock localStorage (100% Jest)
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
  });

  // -------------------------------------------------------
  // BASIC
  // -------------------------------------------------------

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // -------------------------------------------------------
  // LOGIN
  // -------------------------------------------------------

  it('should login, save token & user, and redirect', () => {
    const mockCredentials: LoginRequest = {
      email: 'john@doe.com',
      password: '1234'
    };

    const mockResponse: AuthResponse = {
      id: 1,
      username: 'John',
      email: 'john@doe.com',
      token: 'jwt-token'
    };

    service.login(mockCredentials).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);

    req.flush(mockResponse);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.token);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({
        id: mockResponse.id,
        username: mockResponse.username,
        email: mockResponse.email
      })
    );

    expect(routerMock.navigate).toHaveBeenCalledWith(['/feed']);
  });

  // -------------------------------------------------------
  // REGISTER
  // -------------------------------------------------------

  it('should register, save token & redirect', () => {
    const mockData: RegisterRequest = {
      username: 'John',
      email: 'john@doe.com',
      password: '1234'
    };

    const mockResponse: AuthResponse = {
      id: 1,
      username: 'John',
      email: 'john@doe.com',
      token: 'jwt-token'
    };

    service.register(mockData).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);

    req.flush(mockResponse);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.token);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/feed']);
  });

  // -------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------

  it('should remove token & user on logout and redirect', () => {
    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  // -------------------------------------------------------
  // isAuthenticated()
  // -------------------------------------------------------

  it('should return true if token exists', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return false if token does not exist', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    expect(service.isAuthenticated()).toBe(false);
  });

  // -------------------------------------------------------
  // getCurrentUser()
  // -------------------------------------------------------

  it('should return parsed user object', () => {
    const mockUser = {
      id: 1,
      username: 'John',
      email: 'john@doe.com'
    };

    (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockUser));

    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('should return null if user not found', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    expect(service.getCurrentUser()).toBeNull();
  });

  // -------------------------------------------------------
  // getToken()
  // -------------------------------------------------------

  it('should return token if exists', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('abc123');
    expect(service.getToken()).toBe('abc123');
  });

  it('should return null if no token', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    expect(service.getToken()).toBeNull();
  });
});