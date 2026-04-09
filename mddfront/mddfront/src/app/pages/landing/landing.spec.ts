import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Landing } from './landing';

describe('Landing', () => {
  let component: Landing;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Landing],
      providers: [
        provideRouter([])
      ]
    });

    const fixture = TestBed.createComponent(Landing);
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
  // onLoginClick()
  // -------------------------------------------------------

  describe('onLoginClick', () => {
    it('should navigate to /login', () => {
      component.onLoginClick();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to /login exactly once', () => {
      component.onLoginClick();

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------
  // onRegisterClick()
  // -------------------------------------------------------

  describe('onRegisterClick', () => {
    it('should navigate to /register', () => {
      component.onRegisterClick();

      expect(router.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('should navigate to /register exactly once', () => {
      component.onRegisterClick();

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });

    it('should not navigate to /login when register is clicked', () => {
      component.onRegisterClick();

      expect(router.navigate).not.toHaveBeenCalledWith(['/login']);
    });
  });


});