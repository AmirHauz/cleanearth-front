import { Cupon } from "./cupon.model";

export interface TakenCupon
{
  id: number;
  reward: Cupon;
  amount:number
  status:string ;
  uniqueId:string;
}
