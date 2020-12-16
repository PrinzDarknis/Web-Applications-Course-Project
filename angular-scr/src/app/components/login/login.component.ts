import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(
    private flashMessage: FlashMessagesService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onLoginSubmit() {
    // Check
    if (!this.username || !this.password) {
      this.flashMessage.show('Please insert Username and Password', {
        cssClass: 'alert-danger',
        timeout: 3000,
      });
      return;
    }

    // Login
    this.userService
      .loginUser(this.username, this.password)
      .subscribe((data) => {
        if (data.success) {
          this.flashMessage.show('You are now logged in', {
            cssClass: 'alert-success',
            timeout: 5000,
          });
          this.router.navigate(['profile']);
        } else {
          this.flashMessage.show(
            data.msg || 'unforeseen error, please contact admin',
            {
              cssClass: 'alert-danger',
              timeout: 5000,
            }
          );
          this.router.navigate(['login']);
        }
      });
  }
}
