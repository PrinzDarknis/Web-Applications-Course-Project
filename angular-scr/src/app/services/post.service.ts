import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of, Subscriber } from 'rxjs';

import {
  GetPostResponse,
  GetPostsResponse,
  Post,
  WriteCommentResponse,
  WritePostResponse,
} from '../models';
import { UserService } from './user.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[];
  private postsObervable: Observable<Post[]>;
  private postsOberver: Subscriber<Post[]>;
  private newestDate: Date;
  private oldestDate: Date;
  private authorID: string;
  private authorPosts: Post[];
  private authorPostsObervable: Observable<Post[]>;
  private authorPostsOberver: Subscriber<Post[]>;
  private authorNewestDate: Date;
  private authorOldestDate: Date;
  private selectedPost: Post;

  private postsObserverCallbacks = [];

  constructor(
    private flashMessage: FlashMessagesService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  getPosts(load_more: boolean = false): Observable<Post[]> {
    // Load Observable
    if (!this.postsObervable) {
      this.postsObervable = new Observable<Post[]>((observer) => {
        this.postsOberver = observer;
      });
      this.postsObervable.subscribe();
    }

    let params = '';

    // Update
    let update = !load_more && typeof this.newestDate != 'undefined';
    if (update) {
      params = `newer=${this.newestDate}`;
    }

    // load more
    let more = load_more && typeof this.oldestDate != 'undefined';
    if (more) {
      params = `older=${this.oldestDate}`;
    }

    // Load All
    let obs: Observable<GetPostsResponse> = this.http
      .get<GetPostsResponse>(
        `${this.userService.apiServer}/api/posts?${params}`,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));

    obs.subscribe((response) => {
      if (response.success) {
        if (update) {
          this.posts = response.result.concat(this.posts);
          if (response.firstDate) this.newestDate = response.firstDate;
        } else if (more) {
          this.posts = this.posts.concat(response.result);
          if (response.lastDate) this.oldestDate = response.lastDate;
        } else {
          this.posts = response.result;
          if (response.firstDate) this.newestDate = response.firstDate;
          if (response.lastDate) this.oldestDate = response.lastDate;
        }
      } else {
        this.flashMessage.show(
          `Couldn't load Posts: ${response.msg || 'Something went wrong'}`,
          {
            cssClass: 'alert-danger',
            timeout: 3000,
          }
        );
      }

      this.postsOberver.next(this.posts);
    });

    return this.postsObervable;
  }

  getAuthorPosts(
    authorID: string,
    load_more: boolean = false
  ): Observable<Post[]> {
    // Load Observable
    if (!this.authorPostsObervable) {
      this.authorPostsObervable = new Observable<Post[]>((observer) => {
        this.authorPostsOberver = observer;
      });
      this.authorPostsObervable.subscribe();
    }

    let params = '';

    // Update
    let update =
      authorID == this.authorID &&
      !load_more &&
      typeof this.authorNewestDate != 'undefined';
    if (update) {
      params = `newer=${this.authorNewestDate}`;
    }

    // load more
    let more =
      authorID == this.authorID &&
      load_more &&
      typeof this.authorOldestDate != 'undefined';
    if (more) {
      params = `older=${this.authorOldestDate}`;
    }

    //Save author
    this.authorID = authorID;

    let obs: Observable<GetPostsResponse> = this.http
      .get<GetPostsResponse>(
        `${this.userService.apiServer}/api/posts?author=${authorID}&${params}`,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));

    obs.subscribe((response) => {
      if (response.success) {
        if (update) {
          this.authorPosts = response.result.concat(this.authorPosts);
          if (response.firstDate) this.authorNewestDate = response.firstDate;
        } else if (more) {
          this.authorPosts = this.authorPosts.concat(response.result);
          if (response.lastDate) this.authorOldestDate = response.lastDate;
        } else {
          this.authorPosts = response.result;
          if (response.firstDate) this.authorNewestDate = response.firstDate;
          if (response.lastDate) this.authorOldestDate = response.lastDate;
        }
      } else {
        this.flashMessage.show(
          `Couldn't load Posts: ${response.msg || 'Something went wrong'}`,
          {
            cssClass: 'alert-danger',
            timeout: 3000,
          }
        );
      }

      this.authorPostsOberver.next(this.authorPosts);
    });

    return this.authorPostsObervable;
  }

  selectPost(index: number, isAuthorPost: boolean) {
    if (isAuthorPost) this.selectedPost = this.authorPosts[index];
    else this.selectedPost = this.posts[index];
  }

  getPost(id: string): Observable<Post> {
    return new Observable<Post>((observer) => {
      let onlyComments =
        typeof this.selectedPost != 'undefined' && id == this.selectedPost._id;

      let obs: Observable<GetPostResponse> = this.http
        .get<GetPostResponse>(
          `${this.userService.apiServer}/api/posts/${id}?onlyComments=${onlyComments}`,
          this.userService.httpOptions
        )
        .pipe(catchError(this.errorHandler));

      obs.subscribe((response) => {
        if (response.success) {
          if (onlyComments)
            this.selectedPost.comments = response.result.comments;
          else this.selectedPost = response.result;
          observer.next(this.selectedPost);
        } else {
          this.flashMessage.show(
            `Couldn't load Post: ${response.msg || 'Something went wrong'}`,
            {
              cssClass: 'alert-danger',
              timeout: 3000,
            }
          );
          observer.next();
        }
      });
    });
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
