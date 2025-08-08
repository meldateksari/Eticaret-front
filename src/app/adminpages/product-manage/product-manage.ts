import { Component } from '@angular/core';
import {AdminpagesSidebar} from '../adminpages-sidebar/adminpages-sidebar';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-product-manage',
  imports: [
    AdminpagesSidebar,
    RouterLink
  ],
  templateUrl: './product-manage.html',
  styleUrl: './product-manage.css'
})
export class ProductManage {

}
