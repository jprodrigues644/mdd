import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth-guard';

const mockRoute = {} as ActivatedRouteSnapshot;
const mockState = {} as RouterStateSnapshot;

describe('authGuard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // -------------------------------------------------------
  // with token
  // -------------------------------------------------------

  describe('when a token is present', () => {
    it('should return true', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');

      const result = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
    });

    it('should not redirect', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');

      TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should read token from localStorage with key "token"', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');

      TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );

      expect(localStorage.getItem).toHaveBeenCalledWith('token');
    });
  });

  // -------------------------------------------------------
  // no token
  // -------------------------------------------------------

  describe('when no token is present', () => {
    it('should redirect to /login', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should redirect to /login exactly once', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });

    it('should return true even when no token is present', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
    });

    it('should log access denied message', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      TestBed.runInInjectionContext(() =>
        authGuard(mockRoute, mockState)
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Access denied')
      );
      consoleSpy.mockRestore();
    });
  });
});