import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService, TaskQueryParams, CreateTaskDto, UpdateTaskDto } from './task.service';
import { ENVIRONMENT } from '@shared/config/environment.token';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const mockEnv = { apiBaseUrl: 'http://test-api.com/api' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TaskService,
        { provide: ENVIRONMENT, useValue: mockEnv }
      ]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should send GET request without params', () => {
      service.getAll().subscribe();
      const req = httpMock.expectOne('http://test-api.com/api/tasks');
      expect(req.request.method).toBe('GET');
      req.flush({ data: { items: [], totalCount: 0 } });
    });

    it('should send GET request with params', () => {
      const params: TaskQueryParams = {
        columnId: '123',
        priority: 'high',
        search: 'test',
        sortBy: 'title',
        sortDirection: 'asc',
        page: 1,
        pageSize: 10
      };
      
      service.getAll(params).subscribe();
      const req = httpMock.expectOne((request) => {
        return request.url === 'http://test-api.com/api/tasks' &&
               request.params.get('columnId') === '123' &&
               request.params.get('priority') === 'high' &&
               request.params.get('search') === 'test' &&
               request.params.get('sortBy') === 'title' &&
               request.params.get('sortDirection') === 'asc' &&
               request.params.get('page') === '1' &&
               request.params.get('pageSize') === '10';
      });
      expect(req.request.method).toBe('GET');
      req.flush({ data: { items: [], totalCount: 0 } });
    });
  });

  describe('getById', () => {
    it('should send GET request for specific task', () => {
      service.getById('task-1').subscribe();
      const req = httpMock.expectOne('http://test-api.com/api/tasks/task-1');
      expect(req.request.method).toBe('GET');
      req.flush({ data: { id: 'task-1' } });
    });
  });

  describe('create', () => {
    it('should send POST request to create task', () => {
      const dto: CreateTaskDto = { title: 'New Task', description: 'Desc' } as any;
      service.create(dto).subscribe();
      const req = httpMock.expectOne('http://test-api.com/api/tasks');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush({ data: { id: 'new-id', ...dto } });
    });
  });

  describe('update', () => {
    it('should send PUT request to update task', () => {
      const dto: UpdateTaskDto = { title: 'Updated Task' };
      service.update('task-1', dto).subscribe();
      const req = httpMock.expectOne('http://test-api.com/api/tasks/task-1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush({ data: { id: 'task-1', ...dto } });
    });
  });

  describe('delete', () => {
    it('should send DELETE request for specific task', () => {
      service.delete('task-1').subscribe();
      const req = httpMock.expectOne('http://test-api.com/api/tasks/task-1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ data: null });
    });
  });

  describe('move', () => {
    it('should send PATCH request to move task', () => {
      service.move('task-1', 'col-2').subscribe();
      const req = httpMock.expectOne('http://test-api.com/api/tasks/task-1/move');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ columnId: 'col-2' });
      req.flush({ data: null });
    });
  });
});
