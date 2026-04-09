import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SubjectService } from './subject';
import { SubjectResponse } from '../../shared/models/subject.model';

describe('SubjectService', () => {
  let service: SubjectService;
  let httpMock: HttpTestingController;

  const mockSubjects: SubjectResponse[] = [
    { id: 1, title: 'Subject A', description: 'Desc A' },
    { id: 2, title: 'Subject B', description: 'Desc B' }
  ];

  const mockSubject: SubjectResponse = { id: 1, title: 'Subject A', description: 'Desc A' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubjectService]
    });

    service = TestBed.inject(SubjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ---------------------------
  // Tests unitaires (mock HTTP)
  // ---------------------------

  describe('Unit Tests', () => {
    it('getAll() should call GET /api/subjects and return all subjects', () => {
      service.getAll().subscribe((subjects) => {
        expect(subjects).toEqual(mockSubjects);
      });

      const req = httpMock.expectOne((request) =>
        request.url.endsWith('/subjects') && request.method === 'GET'
      );

      req.flush(mockSubjects);
    });

    it('subscribe() should call POST /api/subjects/:id/subscribe', () => {
      service.subscribe(1).subscribe((subject) => {
        expect(subject).toEqual(mockSubject);
      });

      const req = httpMock.expectOne((request) =>
        request.url.endsWith('/1/subscribe') && request.method === 'POST'
      );

      req.flush(mockSubject);
    });

    it('unsubscribe() should call POST /api/subjects/:id/unsubscribe', () => {
      service.unsubscribe(1).subscribe((subject) => {
        expect(subject).toEqual(mockSubject);
      });

      const req = httpMock.expectOne((request) =>
        request.url.endsWith('/1/unsubscribe') && request.method === 'POST'
      );

      req.flush(mockSubject);
    });
  });

  
});