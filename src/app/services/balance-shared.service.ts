import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceSharedService {
  private balanceSubject = new BehaviorSubject<number>(0);
  private tempBalanceSubject = new BehaviorSubject<number>(0);


  get balance$(){
    return this.balanceSubject.asObservable();
  }

  get tempBalance$ (){
    return this.tempBalanceSubject.asObservable();
  }

  constructor() {}

  updateBalance(balance: number): void {
    this.balanceSubject.next(balance);
  }

  updateTempBalance(itemPrice: number): void {
    const lastValue = this.balanceSubject.value
    this.tempBalanceSubject.next(lastValue - itemPrice);
  }


}
