import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { User_Register } from '../../models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user: User_Register = {
    name: '',
    username: '',
    email: '',
    password: '',
  };

  constructor(
    private flashMessage: FlashMessagesService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onRegisterSubmit() {
    // Trim
    this.user.name = this.user.name.trim();
    this.user.username = this.user.username.trim();
    this.user.email = this.user.email.trim();

    let errors = 'Invalide Input:\n';
    // Check Name
    if (this.user.name.length < 1) {
      errors += 'Please insert Name.\n';
    }

    // Check Username
    if (this.user.username.length < 3) {
      errors += 'The Username must contain min. 3 Characters.\n';
    }

    // Check Password
    if (this.user.password.length < 3) {
      errors += 'The Password must contain min. 3 Characters.\n';
    }

    // Check Email
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(this.user.email.toLowerCase())) {
      errors += 'Please insert valide Email.\n';
    }

    // Error Output
    if (errors.localeCompare('Invalide Input:\n') != 0) {
      this.flashMessage.show(errors, {
        cssClass: 'alert-danger',
        timeout: 5000,
      });
      return false;
    }

    // Register User
    this.userService.registerUser(this.user).subscribe((data) => {
      if (data.success) {
        this.flashMessage.show('You are now registered and can log in', {
          cssClass: 'alert-success',
          timeout: 3000,
        });
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show(data.msg || 'Something went wrong', {
          cssClass: 'alert-danger',
          timeout: 3000,
        });
        this.router.navigate(['/register']);
      }
    });
  }
}
