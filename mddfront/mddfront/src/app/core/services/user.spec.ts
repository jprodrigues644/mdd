import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user';
import { UserResponse, UpdateUserRequest } from '../../shared/models/user.model';

const mockUserResponse: UserResponse = {
  id: 1,
  username: 'JohnDoe',
  email: 'john@doe.com',
  subscriptions: []
};

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

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
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMe', () => {
    it('should call GET /api/users/me and return user data', () => {
      service.getMe().subscribe((user) => {
        expect(user).toEqual(mockUserResponse);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users/me');
      expect(req.request.method).toBe('GET');
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

      const req = httpMock.expectOne('http://localhost:8080/api/users/me');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedResponse);
    });
  });
});