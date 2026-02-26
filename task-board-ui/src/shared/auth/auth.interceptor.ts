import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // withCredentials is set per-request in BaseApiService
  // This interceptor is currently a pass-through layer as requested, since 401s are handled by errorInterceptor
  // and credentials are automatically sent by the browser.
  return next(req);
};
