import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { Observable, throwError, empty } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Here we handle the request and add the header:
    request = this.addAuthHeader(request);

    // We return next and handle the response:

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if(error.status === 401){
          // 401 means we are unauthorized, we refresh 
          // the access token:

          return this.refreshAccessToken().pipe(
            switchMap(() => {
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err) => {
              console.log(err);
              this.authService.logout();
              return empty();
            })
          )
        }
        return throwError(error);
      })
    )
  }

  refreshAccessToken(){
    // Call a method in the auth service, to send
    // a request and refresh the access token when
    // it expires

    return this.authService.getNewAccessToken().pipe(
      tap(() => {
        console.log('Access token refreshed!');
      })
    )
  }

  addAuthHeader(request: HttpRequest<any>){
    const token = this.authService.getAccessToken();

    if(token){
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }

    return request;
  }
}
