import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private flashMessage: FlashMessagesService,
    public userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onLogoutClick() {
    this.userService.logout();
    this.flashMessage.show('You are logged out', {
      cssClass: 'alert-success',
      timeout: 3000,
    });
    this.router.navigate(['/login']);
    return false;
  }
}
