import { Cupon } from "./cupon.model";

export interface CartItem
{
  id?: number;
  total: number;
  reward: number;
  amount: number;
}

export interface CartItemDisplay
{
  id: number;
  total: number;
  reward: Cupon;
  amount: number;
}
