import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  imports: [
    RouterLink,
    AsyncPipe
  ],
})
export class Header implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  user!:Observable <User>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
     this.user = this.authService.user$;
  }



  logout(): void {
    this.authService.logout();
  }
}
