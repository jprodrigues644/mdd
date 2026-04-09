import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { unauthGuard } from './unauth-guard';

const mockRoute = {} as ActivatedRouteSnapshot;
const mockState = {} as RouterStateSnapshot;

describe('unauthGuard', () => {
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
  // no token
  // -------------------------------------------------------

  describe('when no token is present', () => {
    it('should return true', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = TestBed.runInInjectionContext(() =>
        unauthGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
    });

    it('should not redirect', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      TestBed.runInInjectionContext(() =>
        unauthGuard(mockRoute, mockState)
      );

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should read token from localStorage with key "token"', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      TestBed.runInInjectionContext(() =>
        unauthGuard(mockRoute, mockState)
      );

      expect(localStorage.getItem).toHaveBeenCalledWith('token');
    });
  });

  // -------------------------------------------------------
  // with token
  // -------------------------------------------------------

  describe('when a token is present', () => {
    it('should redirect to /feed', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');

      TestBed.runInInjectionContext(() =>
        unauthGuard(mockRoute, mockState)
      );

      expect(router.navigate).toHaveBeenCalledWith(['/feed']);
    });

    it('should redirect to /feed exactly once', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');

      TestBed.runInInjectionContext(() =>
        unauthGuard(mockRoute, mockState)
      );

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });

    it('should return true even when token is present', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('jwt-token');

      const result = TestBed.runInInjectionContext(() =>
        unauthGuard(mockRoute, mockState)
      );

      expect(result).toBe(true);
    });
  });
});