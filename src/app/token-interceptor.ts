import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('401')
          return this.authService.refreshAccessToken().pipe(
            switchMap(() => {
              // Retry the original request with the new access token
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.authService.accessToken$  }`
                }
              });
              return next.handle(newReq);
            }),
            catchError(refreshError => {
              // Handle refresh token failure
              this.authService.logout(); // Log out the user
              return throwError(refreshError);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
