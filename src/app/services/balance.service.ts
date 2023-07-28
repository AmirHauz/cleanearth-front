import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, Subject, switchMap } from 'rxjs';
import { Balance } from '../models/balance.model ';
@Injectable({
  providedIn: 'root'
})
export class BalanceService {
private readonly MYSERVER = 'http://127.0.0.1:8000/balance/'

private balanceSubject = new BehaviorSubject<number>(0);
private tempBalanceSubject = new BehaviorSubject<number>(0);

constructor(private http: HttpClient) { }


get balance$(): Observable<number> {
  return this.balanceSubject.asObservable();
}

get tempBalance$(): Observable<number> {
  return this.tempBalanceSubject.asObservable();
}

updateBalance(balance: number): void {
  this.balanceSubject.next(balance);
}


updateTempBalance(tempBalance: number): void {
  this.tempBalanceSubject.next(tempBalance);
}

getBalance(token$: Observable<string>): Observable<Balance> {
  return token$.pipe(
    switchMap(token => {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      return this.http.get<Balance>(this.MYSERVER, { headers });
    })
  );
}


}
