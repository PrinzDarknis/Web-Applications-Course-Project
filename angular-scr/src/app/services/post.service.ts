import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {
  GetPostResponse,
  GetPostsResponse,
  Post,
  WriteCommentResponse,
} from '../models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[];
  private authorPosts: Post[];
  private selectedPost: Post;

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

    let obs = this.http
      .get<GetPostsResponse>(
        `${this.userService.apiServer}/api/posts?author=${authorID}`,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));

    obs.subscribe((response) => {
      this.authorPosts = response.result;
    });
    return obs;
  }

  selectPost(index: number, isAuthorPost: boolean) {
    if (isAuthorPost) this.selectedPost = this.authorPosts[index];
    else this.selectedPost = this.posts[index];
  }

  getPost(id: string): Observable<GetPostResponse> {
    // TODO selectedPost (cache)
    // if (this.selectedPost && id == this.selectedPost._id) {
    //   return this.selectedPost;
    // }

    let obs = this.http
      .get<GetPostResponse>(
        `${this.userService.apiServer}/api/posts/${id}`,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));

    return obs;
  }

  writeComment(postID: string, text: string): Observable<WriteCommentResponse> {
    return this.http
      .post<GetPostResponse>(
        `${this.userService.apiServer}/api/posts/${postID}/comment`,
        { text },
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
