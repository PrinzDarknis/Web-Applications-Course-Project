import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {
  GetPostResponse,
  GetPostsResponse,
  Post,
  WriteCommentResponse,
  WritePostResponse,
} from '../models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[];
  private authorPosts: Post[];
  private selectedPost: Post;

  private postsObserverCallbacks = [];

  constructor(private userService: UserService, private http: HttpClient) {}

  newPostsSubscipe(callback) {
    this.postsObserverCallbacks.push(callback);
  }
  newPostsUnsubscipe(callback) {
    let index = this.postsObserverCallbacks.indexOf(callback);
    if (index >= 0) this.postsObserverCallbacks.splice(index, 1);
  }

  notifyObserver() {
    this.postsObserverCallbacks.forEach((callback) => {
      callback(this.posts);
    });
  }

  getPosts(): Observable<GetPostsResponse> {
    if (this.posts && this.posts.length > 0) return this.updatePosts();
    else {
      // Load All
      let obs: Observable<GetPostsResponse> = this.http
        .get<GetPostsResponse>(
          `${this.userService.apiServer}/api/posts`,
          this.userService.httpOptions
        )
        .pipe(catchError(this.errorHandler));

      obs.subscribe((response) => {
        this.posts = response.result;
        this.notifyObserver();
      });
      return obs;
    }
  }

  updatePosts(): Observable<GetPostsResponse> {
    // TODO Cache Load (current no Cache)
    let obs: Observable<GetPostsResponse> = this.http
      .get<GetPostsResponse>(
        `${this.userService.apiServer}/api/posts`,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));

    obs.subscribe((response) => {
      this.posts = response.result;
      this.notifyObserver();
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

  writePost(
    title: string,
    text: string,
    image: File,
    callback: (response: WritePostResponse) => any
  ): void {
    // Payload
    let formData: FormData = new FormData();
    formData.append('title', title);
    formData.append('text', text);

    if (image) {
      formData.append('image', image, image.name);
    }

    // define Post Callback
    this.http
      .post<WritePostResponse>(
        `${this.userService.apiServer}/api/posts`,
        formData,
        this.userService.httpOptionsOnlyAuth
      )
      .pipe(catchError(this.errorHandler))
      .subscribe(callback);
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
