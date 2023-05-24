import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {


private balanceSubject = new BehaviorSubject<number>(1000);
private tempBalanceSubject = new BehaviorSubject<number>(1000);

get balance$():Observable<number>{
  return this.balanceSubject.asObservable();
}

get tempBalance$():Observable<number>{
  return this.tempBalanceSubject.asObservable();
}

}
