/*import { Role } from './role.model';
import { Address } from './address.model';
import { Review } from './review.model';
import { Cart } from './cart.model';
import { UserProductInteraction } from './interaction.model';*/

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive: boolean;

  /*roles?: Role[];
  addresses?: Address[];
  reviews?: Review[];
  cart?: Cart;
  interactions?: UserProductInteraction[];*/
}
