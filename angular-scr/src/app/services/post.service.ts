import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { GetPostsResponse, Post } from '../models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[];

  constructor(private userService: UserService, private http: HttpClient) {}

  getPosts(): Observable<GetPostsResponse> {
    // TODO Cache Load

    // Load All
    let obs: Observable<GetPostsResponse> = this.http
      .get<GetPostsResponse>(
        `${this.userService.apiServer}/api/posts`,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));

    obs.subscribe((response) => {
      this.posts = response.result;
    });
    return obs;
  }

  getAuthorPosts(authorID: string): Observable<GetPostsResponse> {
    console.log(`${this.userService.apiServer}/api/posts?author=${authorID}`);

    return this.http
      .get<GetPostsResponse>(
        `${this.userService.apiServer}/api/posts?author=${authorID}`,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  // Extract Body on Error
  private errorHandler(err) {
    console.log(err);
    return of(err.error);
  }
}
