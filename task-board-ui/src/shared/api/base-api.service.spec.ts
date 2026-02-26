import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BaseApiService } from './base-api.service';
import { ENVIRONMENT } from '../config/environment.token';
import { HttpParams } from '@angular/common/http';

describe('BaseApiService', () => {
  let service: BaseApiService;
  let httpMock: HttpTestingController;
  const mockEnv = { apiBaseUrl: 'http://test-api.com/api' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BaseApiService,
        { provide: ENVIRONMENT, useValue: mockEnv }
      ]
    });
    service = TestBed.inject(BaseApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform GET request and extract data', () => {
    const mockResponse = { data: 'test-data', message: 'Success', success: true };
    const params = new HttpParams().set('id', '1');
    
    // Call the protected method using array accessor
    (service as any).httpGet('/test', params).subscribe((data: any) => {
      expect(data).toBe('test-data');
    });

    const req = httpMock.expectOne('http://test-api.com/api/test?id=1');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockResponse);
  });

  it('should perform POST request and extract data', () => {
    const mockResponse = { data: { id: 1 }, message: 'Created', success: true };
    const body = { name: 'test' };
    
    (service as any).httpPost('/test', body).subscribe((data: any) => {
      expect(data).toEqual({ id: 1 });
    });

    const req = httpMock.expectOne('http://test-api.com/api/test');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockResponse);
  });

  it('should perform PUT request and extract data', () => {
    const mockResponse = { data: { id: 1, updated: true }, message: 'Updated', success: true };
    const body = { name: 'test-updated' };
    
    (service as any).httpPut('/test/1', body).subscribe((data: any) => {
      expect(data.updated).toBe(true);
    });

    const req = httpMock.expectOne('http://test-api.com/api/test/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockResponse);
  });

  it('should perform PATCH request and extract data', () => {
    const mockResponse = { data: { id: 1, patched: true }, message: 'Patched', success: true };
    const body = { name: 'test-patched' };
    
    (service as any).httpPatch('/test/1', body).subscribe((data: any) => {
      expect(data.patched).toBe(true);
    });

    const req = httpMock.expectOne('http://test-api.com/api/test/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockResponse);
  });

  it('should perform DELETE request and extract data', () => {
    const mockResponse = { data: true, message: 'Deleted', success: true };
    
    (service as any).httpDelete('/test/1').subscribe((data: any) => {
      expect(data).toBe(true);
    });

    const req = httpMock.expectOne('http://test-api.com/api/test/1');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockResponse);
  });
});
