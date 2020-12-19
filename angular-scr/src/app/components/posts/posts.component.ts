import { Component, OnInit, Input } from '@angular/core';
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
export class PostsComponent implements OnInit {
  @Input() author?: string;

  posts: Post[];
  isAuthor: boolean = false;

  subsciption;

  constructor(
    private postService: PostService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.author) {
      // only his Posts
      this.isAuthor = true;
      this.postService
        .getAuthorPosts(this.author)
        .subscribe(this.showPosts.bind(this));
    } else {
      // all Posts
      this.isAuthor = false;
      this.postService.getPosts().subscribe(this.showPosts.bind(this));
    }
  }

  loadMore() {
    this.postService.getPosts(true);
  }

  public showPosts = function (posts: Post[]) {
    let count = 0;
    if (this.posts) count = this.posts.length;

    this.posts = posts;

    if (this.posts.length == count) {
      // No Updates
      this.flashMessage.show(`No new Posts`, {
        cssClass: 'alert-success',
        timeout: 3000,
      });
    }
  };

  openPost(id: string, index: number) {
    this.postService.selectPost(index, this.isAuthor);

    this.router.navigate([`posts/${id}`]);
  }
}
