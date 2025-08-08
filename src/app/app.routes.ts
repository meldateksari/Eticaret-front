import { Routes } from '@angular/router';
import {HomePage} from './pages/home-page/home-page';
import {Register} from './auth/pages/register/register';
import {Login} from './auth/pages/login/login';
import {Profile} from './profilepages/profile/profile';
import {Account} from './profilepages/account/account';
import {Addresses} from './profilepages/addresses/addresses';

import {Returns} from './profilepages/returns/returns';
import {Settings} from './profilepages/settings/settings';
import {Orders} from './profilepages/orders/orders';
import {ProductImage} from './pages/product-image/product-image';
import {Product} from './pages/product/product';
import {CartComponent} from './pages/cart/cart';
import {Checkout} from './pages/checkout/checkout';
import {Payments} from './pages/payments/payments';
import {NewOrder} from './pages/new-order/new-order';
import {ProductDetail} from './pages/product-detail/product-detail';
import {Wishlist} from './pages/wishlist-page/wishlist-page';
import {Reviews} from './pages/reviews/reviews';
import {Support} from './pages/support/support';
import {Dashboard} from './adminpages/dashboard/dashboard';
import {ProductManage} from './adminpages/product-manage/product-manage';
import {OrderManage} from './adminpages/order-manage/order-manage';
import {ReviewManage} from './adminpages/review-manage/review-manage';
import {UserService} from './services/user.service';
import {UserManage} from './adminpages/user-manage/user-manage';
import {AddProducts} from './adminpages/add-products/add-products';
import {AddUsers} from './adminpages/add-users/add-users';
import {EditProducts} from './adminpages/edit-products/edit-products';
import {Faq} from './pages/faq/faq';



export const routes: Routes = [

  //USER
  { path: '', component: HomePage },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'profile', component: Profile },
  { path: 'account', component: Account },
  { path: 'orders', component: Orders },
  { path: 'addresses', component: Addresses },
  { path: 'returns', component: Returns },
  { path: 'wishlist', component: Wishlist },
  { path: 'settings', component: Settings},
  { path: 'product-image', component: ProductImage},
  { path: 'products', component: Product},
  { path: 'cart', component: CartComponent},
  { path: 'checkout', component: Checkout},
  { path: 'payments', component: Payments},
  { path: 'new-order/:id', component: NewOrder},
  { path: 'product/:id', component: ProductDetail},
  { path: 'reviews', component: Reviews },
  { path: 'support', component: Support },
  { path: 'faq', component: Faq},

  //ADMIN
  { path: 'dashboard', component: Dashboard },
  { path: 'product-manage', component: ProductManage },
  { path: 'order-manage', component: OrderManage },
  { path: 'review-manage', component: ReviewManage },
  { path: 'user-manage', component: UserManage },
  { path: 'add-products', component: AddProducts },
  { path: 'edit-products', component: EditProducts },
  { path: 'add-users', component: AddUsers},





];
