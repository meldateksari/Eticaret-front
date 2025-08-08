import { Component } from '@angular/core';
import {NgFor} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';


@Component({
  selector: 'app-adminpages-sidebar',
  imports: [NgFor, RouterLink, RouterLinkActive],
  templateUrl: './adminpages-sidebar.html',
  styleUrl: './adminpages-sidebar.css'
})
export class AdminpagesSidebar {

}
