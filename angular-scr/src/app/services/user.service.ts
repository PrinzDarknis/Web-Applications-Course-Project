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
  ChangeUserDataResponse,
  AskFriendshipResponse,
} from '../models';
import { cookie } from 'express-validator';

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
  httpOptionsOnlyAuth = {};
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

  changePrivacy(privacy: string): Observable<ChangeUserDataResponse> {
    return this.http
      .post<ChangeUserDataResponse>(
        `${this.apiServer}/api/users/${this.user.id}`,
        { privacy },
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  aksFriend(id: string): Observable<AskFriendshipResponse> {
    return this.http
      .post<AskFriendshipResponse>(
        `${this.apiServer}/api/users/${id}/askFriend`,
        {},
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
          this.loadToken();
        }),
        catchError(this.errorHandler)
      );
  }

  logout(): void {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    document.cookie = 'jwt=';
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
    if (token) document.cookie = `jwt=${token.split(' ')[1]}`;

    if (this.loggedIn()) {
      this.httpOptions.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authToken,
      });

      this.httpOptionsOnlyAuth = {
        headers: new HttpHeaders({ Authorization: this.authToken }),
      };
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
