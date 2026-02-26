import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ENVIRONMENT } from '../config/environment.token';
import { ApiResponse } from '../types/api-response.interface';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly env = inject(ENVIRONMENT);

  protected httpGet<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<ApiResponse<T>>(
      `${this.env.apiBaseUrl}${path}`,
      { params, withCredentials: true }
    ).pipe(map(r => r.data));
  }

  protected httpPost<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<ApiResponse<T>>(
      `${this.env.apiBaseUrl}${path}`,
      body,
      { withCredentials: true }
    ).pipe(map(r => r.data));
  }

  protected httpPut<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<ApiResponse<T>>(
      `${this.env.apiBaseUrl}${path}`,
      body,
      { withCredentials: true }
    ).pipe(map(r => r.data));
  }

  protected httpPatch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<ApiResponse<T>>(
      `${this.env.apiBaseUrl}${path}`,
      body,
      { withCredentials: true }
    ).pipe(map(r => r.data));
  }

  protected httpDelete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(
      `${this.env.apiBaseUrl}${path}`,
      { withCredentials: true }
    ).pipe(map(r => r.data));
  }
}
