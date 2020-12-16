import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/models';

import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  @Input() author?: string;

  posts: Post[];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    let cb = (response) => {
      this.posts = response.result;
      console.log(`[PostsComponent] Show ${this.posts.length} Posts`);
    };

    if (this.author) {
      // only his Posts
      this.postService.getAuthorPosts(this.author).subscribe(cb);
    } else {
      // all Posts
      this.postService.getPosts().subscribe(cb);
    }
  }
}
