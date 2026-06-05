import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const PUBLIC_ENDPOINTS = ['/token/', '/token/refresh/', '/token/verify/'];

function isPublicEndpoint(url: string): boolean {
  return PUBLIC_ENDPOINTS.some((ep) => url.includes(ep));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (!isPublicEndpoint(req.url)) {
          auth.logout();
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
