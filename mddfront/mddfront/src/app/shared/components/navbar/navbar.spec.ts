import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Navbar } from './navbar';
import { Auth } from '../../../core/services/auth';

describe('Navbar', () => {
  let component: Navbar;
  let router: Router;

  const authMock = {
    logout: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),                      // ← real router, no mock override
        { provide: Auth, useValue: authMock }
      ]
    });

    const fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true); // ← spy, not replace

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------------
  // BASIC
  // -------------------------------------------------------

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // -------------------------------------------------------
  // logout()
  // -------------------------------------------------------

  describe('logout', () => {
    it('should call auth.logout()', () => {
      component.logout();

      expect(authMock.logout).toHaveBeenCalledTimes(1);
    });

    it('should not call router.navigate on logout', () => {
      component.logout();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------
  // goToProfile()
  // -------------------------------------------------------

  describe('goToProfile', () => {
    it('should navigate to /profile', () => {
      component.goToProfile();

      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should navigate to /profile exactly once', () => {
      component.goToProfile();

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });

    it('should not call auth.logout on goToProfile', () => {
      component.goToProfile();

      expect(authMock.logout).not.toHaveBeenCalled();
    });
  });
});