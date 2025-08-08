import { Component } from '@angular/core';
import {AdminpagesSidebar} from '../adminpages-sidebar/adminpages-sidebar';



@Component({
  selector: 'app-dashboard',
  imports: [
    AdminpagesSidebar

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
