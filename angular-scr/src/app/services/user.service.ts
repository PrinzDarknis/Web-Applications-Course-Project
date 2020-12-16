import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import {
  User,
  User_Register,
  RegisterResponse,
  GetUserResponse,
  AuthenticateResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authToken: string;
  user: User;

  apiServer = '';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    if (isDevMode()) {
      this.apiServer = 'http://localhost'; // in Dev Angular uses own Port
    }

    this.loadToken();
  }

  registerUser(user: User_Register): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(
        `${this.apiServer}/api/users/register`,
        user,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  getUserData(id?: string): Observable<GetUserResponse> {
    this.loadToken();

    if (!id) id = this.user.id;

    return this.http
      .get<GetUserResponse>(
        `${this.apiServer}/api/users/${id}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  loginUser(
    username: string,
    password: string
  ): Observable<AuthenticateResponse> {
    return this.http
      .post<AuthenticateResponse>(
        `${this.apiServer}/api/users/authenticate`,
        { username, password },
        this.httpOptions
      )
      .pipe(
        tap((res) => {
          // Save Data
          localStorage.setItem('jwt', res.token);
          localStorage.setItem('user', JSON.stringify(res.result));
          this.authToken = res.token;
          this.user = res.result;
        }),
        catchError(this.errorHandler)
      );
  }

  logout(): void {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }

  loggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(this.authToken);
  }

  private loadToken(): void {
    let token = localStorage.getItem('jwt');
    this.authToken = token;

    if (this.loggedIn()) {
      this.httpOptions.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authToken,
      });
    }

    try {
      let user = localStorage.getItem('user');
      this.user = JSON.parse(user);
    } catch {}
  }

  // Extract Body on Error
  private errorHandler(err) {
    console.log(err);
    return of(err.error);
  }
}
