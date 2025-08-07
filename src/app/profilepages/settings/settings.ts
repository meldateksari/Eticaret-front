import { Component } from '@angular/core';
import {ProfileSidebar} from '../profile-sidebar/profile-sidebar';

@Component({
  selector: 'app-settings',
  imports: [
    ProfileSidebar
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {

}
