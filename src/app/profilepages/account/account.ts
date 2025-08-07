import { Component } from '@angular/core';
import {ProfileSidebar} from '../profile-sidebar/profile-sidebar';

@Component({
  selector: 'app-account',
  imports: [
    ProfileSidebar
  ],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {

}
