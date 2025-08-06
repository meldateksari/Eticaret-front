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



export const routes: Routes = [
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


];
