import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * 1) Agrega "Authorization: Bearer <token>" a las peticiones hacia nuestra API.
 * 2) Si la API responde 401 estando logueado (token vencido/inválido), cierra la sesión.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const isApiCall = req.url.startsWith(environment.apiUrl);
  const token = auth.getToken();

  const authReq =
    isApiCall && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isLoginCall = req.url.endsWith('/auth/login');
      if (error.status === 401 && isApiCall && !isLoginCall) {
        auth.logout();
      }
      return throwError(() => error);
    })
  );
};
