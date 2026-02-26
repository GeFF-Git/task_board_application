import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  // Only attach CSRF token to state-changing requests
  const requiresCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

  // Skip CSRF for login and register (backend has [IgnoreAntiforgeryToken])
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (requiresCsrf && !isAuthEndpoint) {
    // Read CSRF token from the readable cookie set by backend
    const csrfToken = getCookieValue('taskboard_csrf', req);

    if (csrfToken) {
      console.log(csrfToken, 'csrfToken');
      req = req.clone({
        headers: req.headers.set('X-CSRF-TOKEN', csrfToken),
      });
    }
  }

  return next(req);
};

function getCookieValue(name: string, req: HttpRequest<unknown>): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
