import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
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
  isAuthor: boolean = false;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    let cb = (response) => {
      this.posts = response.result;
      console.log(`[PostsComponent] Show ${this.posts.length} Posts`);
    };

    if (this.author) {
      // only his Posts
      this.isAuthor = true;
      this.postService.getAuthorPosts(this.author).subscribe(cb);
    } else {
      // all Posts
      this.isAuthor = false;
      this.postService.getPosts().subscribe(cb);
    }
  }

  openPost(id: string, index: number) {
    this.postService.selectPost(index, this.isAuthor);

    this.router.navigate([`posts/${id}`]);
  }
}
