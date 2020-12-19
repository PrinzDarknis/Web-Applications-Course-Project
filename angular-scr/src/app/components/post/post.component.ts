import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Location } from '@angular/common';

import { Post } from 'src/app/models';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  post: Post;
  commentText: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private flashMessage: FlashMessagesService,
    private postService: PostService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id).subscribe((post) => {
      if (!post) {
        this.location.back();
        return;
      }

      this.post = post;
    });
  }

  writeComment() {
    this.commentText = this.commentText.trim();
    if (this.commentText.length > 0) {
      this.postService
        .writeComment(this.post._id, this.commentText)
        .subscribe((response) => {
          if (response.success) {
            this.post.comments.unshift(response.result);
          } else {
            this.flashMessage.show(
              `Couldn't post Comment: ${
                response.msg || 'Something went wrong'
              }`,
              {
                cssClass: 'alert-danger',
                timeout: 3000,
              }
            );
          }
        });
    }
  }
}
