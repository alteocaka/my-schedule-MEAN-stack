import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router  } from '@angular/router';
import { WebRequestService } from './web-request.service';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private service: WebRequestService) { }

  login(email, password){
    return this.service.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // The auth tokens will be in the header of this response:
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        console.log('Logged in successfully!');
      })
    )
  }

  logut(){
    this.removeSession();
    console.log('You have been logged out!');
  }

  getAccessToken(){
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken(){
    return localStorage.getItem('x-refresh-token');
  }

  setAccessToken(accessToken: string){
    localStorage.setItem('x-access-token', accessToken);
  }

  setSession(userId: string, accessToken: string, refreshToken: string){
    localStorage.setItem('user-id', userId);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refresh-Token', refreshToken);
  }

  // For logout:

  removeSession(){
    localStorage.removeItem('user-id');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refresh-Token');
  }

}
