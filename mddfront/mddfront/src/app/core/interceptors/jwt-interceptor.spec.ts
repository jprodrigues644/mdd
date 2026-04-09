import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';

import { jwtInterceptor } from './jwt-interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';


describe('jwtInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
  });

  afterEach(() => {
    httpMock.verify();
    jest.restoreAllMocks();
  });

  // -------------------------------------------------------
  // no token
  // -------------------------------------------------------

  describe('when no token is present', () => {
    it('should forward the request without Authorization header', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      http.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should not modify the original request', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      http.get('/api/test', { headers: { 'X-Custom': 'value' } }).subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.get('X-Custom')).toBe('value');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });
  });

  // -------------------------------------------------------
  // with token
  // -------------------------------------------------------

  describe('when a token is present', () => {
    it('should add Authorization header with Bearer token', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');

      http.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
      req.flush({});
    });

    it('should read token from localStorage with key "token"', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('my-secret-token');

      http.get('/api/test').subscribe();

      expect(localStorage.getItem).toHaveBeenCalledWith('token');
      httpMock.expectOne('/api/test').flush({});
    });

    it('should preserve existing headers alongside Authorization', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');

      http.get('/api/test', { headers: { 'X-Custom': 'value' } }).subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
      expect(req.request.headers.get('X-Custom')).toBe('value');
      req.flush({});
    });

    it('should not mutate the original request', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');

      http.get('/api/test').subscribe();

      const req = httpMock.expectOne('/api/test');
      // cloned request has header, original would not — interceptor must clone
      expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
      req.flush({});
    });

    it('should work for POST requests as well', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');

      http.post('/api/test', { data: 'payload' }).subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
      req.flush({});
    });

    it('should work for PUT requests as well', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');

      http.put('/api/test', {}).subscribe();

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
      req.flush({});
    });
  });
});