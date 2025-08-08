import { Component } from '@angular/core';
import {AdminpagesSidebar} from '../adminpages-sidebar/adminpages-sidebar';

@Component({
  selector: 'app-user-manage',
  imports: [
    AdminpagesSidebar
  ],
  templateUrl: './user-manage.html',
  styleUrl: './user-manage.css'
})
export class UserManage {

}
