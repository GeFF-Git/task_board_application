import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@shared/api/base-api.service';
import { ENVIRONMENT } from '@shared/config/environment.token';
import { LoginRequestDto, RegisterRequestDto, AuthUser } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseApiService {
  getCsrfToken(): Observable<void> {
    const url = this.env.csrfEndpoint;
    
    return this.http.get<void>(
      url,
      { withCredentials: true }
    );
  }

  getCurrentUser(): Observable<AuthUser> {
    return this.httpGet<AuthUser>('/auth/me');
  }

  login(dto: LoginRequestDto): Observable<AuthUser> {
    return this.httpPost<AuthUser>('/auth/login', dto);
  }

  register(dto: RegisterRequestDto): Observable<AuthUser> {
    return this.httpPost<AuthUser>('/auth/register', dto);
  }

  logout(): Observable<void> {
    return this.httpPost<void>('/auth/logout', {});
  }
}
