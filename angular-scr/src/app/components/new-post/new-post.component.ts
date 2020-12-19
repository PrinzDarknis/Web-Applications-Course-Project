import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  title: string;
  text: string;
  image: File;

  constructor(
    private flashMessage: FlashMessagesService,
    private postService: PostService,
    private router: Router,
    public userService: UserService
  ) {}

  ngOnInit(): void {}

  fileChanged(files: FileList) {
    this.image = files.item(0);
  }

  writePost() {
    this.title = this.title.trim();
    this.text = this.text.trim();

    if (this.title.length >= 1 && this.text.length >= 3) {
      this.postService.writePost(
        this.title,
        this.text,
        this.image,
        (response) => {
          if (response.success) {
            this.title = '';
            this.text = '';

            this.flashMessage.show(`Post posted`, {
              cssClass: 'alert-success',
              timeout: 3000,
            });

            this.postService.getPosts();
          } else {
            this.flashMessage.show(
              `Couldn't post: ${response.msg || 'Something went wrong'}`,
              {
                cssClass: 'alert-danger',
                timeout: 3000,
              }
            );
          }
        }
      );
    }
  }
}
