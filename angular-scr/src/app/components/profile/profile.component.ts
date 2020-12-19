import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { UserService } from '../../services/user.service';
import { User } from '../../models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User;
  showPopup: boolean = false;
  isFriend: boolean;
  isFriendAsked: boolean;

  availablePrivacies = ['everyone', 'registered', 'friends', 'private'];

  constructor(
    private flashMessage: FlashMessagesService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.userService.getUserData(id).subscribe((data) => {
      if (data.success) this.user = data.result;
      if (this.user.friends)
        this.user.friends.forEach((friend) => {
          if (friend._id == this.userService.user.id) this.isFriend = true;
        });
      if (!this.isFriend && this.user.friendsAsked)
        this.user.friendsAsked.forEach((friend) => {
          if (friend._id == this.userService.user.id) this.isFriendAsked = true;
        });
    });
  }

  changePrivacy(newPrivacy) {
    this.userService.changePrivacy(newPrivacy).subscribe((response) => {
      if (response.success) {
        this.user.privacy = response.result.privacy;
      } else {
        this.flashMessage.show(
          `Couldn't update Privacy: ${response.msg || 'Something went wrong'}`,
          {
            cssClass: 'alert-danger',
            timeout: 3000,
          }
        );
      }
    });
  }

  askedFriend() {
    this.userService.aksFriend(this.user.id).subscribe((response) => {
      if (response.success) {
        if (response.state == 'friend') {
          this.isFriend = true;
          this.flashMessage.show(`You are now Friends`, {
            cssClass: 'alert-success',
            timeout: 3000,
          });
        } else {
          this.isFriendAsked = true;
          this.flashMessage.show(`Asked for Friendship`, {
            cssClass: 'alert-success',
            timeout: 3000,
          });
        }
      } else {
        this.flashMessage.show(
          `Couldn't aske User: ${response.msg || 'Something went wrong'}`,
          {
            cssClass: 'alert-danger',
            timeout: 3000,
          }
        );
      }
    });
  }
}
