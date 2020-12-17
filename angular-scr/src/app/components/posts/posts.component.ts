import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Post } from 'src/app/models';

import { PostService } from '../../services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit, OnDestroy {
  @Input() author?: string;

  posts: Post[];
  isAuthor: boolean = false;

  constructor(
    private postService: PostService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    let cb = (response) => {
      if (response.success) {
        this.posts = response.result;
        console.log(`[PostsComponent] Show ${this.posts.length} Posts`);
      } else {
        this.flashMessage.show(
          `Couldn't load Posts: ${response.msg || 'Something went wrong'}`,
          {
            cssClass: 'alert-danger',
            timeout: 3000,
          }
        );
      }
    };

    if (this.author) {
      // only his Posts
      this.isAuthor = true;
      this.postService.getAuthorPosts(this.author).subscribe(cb);
    } else {
      // all Posts
      this.isAuthor = false;
      this.postService.newPostsSubscipe(this.loadNewPosts.bind(this)); // without bind this will be undefinded
      this.postService.getPosts().subscribe(cb);
    }
  }

  ngOnDestroy(): void {
    this.postService.newPostsUnsubscipe(this.loadNewPosts);
  }

  public loadNewPosts = function (posts: Post[]) {
    this.posts = posts;
  };

  openPost(id: string, index: number) {
    this.postService.selectPost(index, this.isAuthor);

    this.router.navigate([`posts/${id}`]);
  }
}
