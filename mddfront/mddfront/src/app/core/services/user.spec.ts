import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user';
import { UserResponse, UpdateUserRequest } from '../../shared/models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  // Mock user response pour les tests
  const mockUserResponse: UserResponse = {
    id: 1,
    username: 'JohnDoe',
    email: 'john@doe.com',
    subscriptions: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMe', () => {
    it('should call GET /api/users/me and return user data', () => {
      service.getMe().subscribe((user) => {
        expect(user).toEqual(mockUserResponse);
      });

      // Matcher flexible pour éviter les erreurs d'URL exactes
      const req = httpMock.expectOne((request) =>
        request.url.endsWith('/me') && request.method === 'GET'
      );

      req.flush(mockUserResponse);
    });
  });

  describe('updateMe', () => {
    it('should call PUT /api/users/me with data and return updated user', () => {
      const updateData: UpdateUserRequest = {
        username: 'JaneSmith',
        email: 'jane@smith.com'
      };

      const updatedResponse: UserResponse = {
        ...mockUserResponse,
        ...updateData
      };

      service.updateMe(updateData).subscribe((user) => {
        expect(user).toEqual(updatedResponse);
      });

      const req = httpMock.expectOne((request) =>
        request.url.endsWith('/me') && request.method === 'PUT'
      );

      expect(req.request.body).toEqual(updateData);
      req.flush(updatedResponse);
    });
  });
});