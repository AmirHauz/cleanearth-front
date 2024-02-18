import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, switchMap, tap, catchError } from 'rxjs';
import { Balance } from '../models/balance.model ';
import { BalanceSharedService } from './balance-shared.service';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private readonly MYSERVER = 'http://127.0.0.1:8000/';

  constructor(
    private http: HttpClient,
    private balanceSharedService: BalanceSharedService
  ) {}

  getBalance(token$: Observable<string>): Observable<Balance> {
    return token$.pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
        return this.http.get<Balance>(this.MYSERVER + "balance/", { headers }).pipe(
          tap((balance: Balance) => {
            console.log('update balances ', balance);
            this.updateBalances(balance.balance, balance.cartTotal);
            console.log('Response for balance:', balance.balance);
            console.log('Response for CARTTOTAL', balance.cartTotal);
          }),
          catchError((error) => {
            console.error('Error occurred while fetching balance:', error);
            return throwError(error);
          })
        );
      })
    );
  }


  private updateBalances(balance: number, cartTotal: number): void {
    this.balanceSharedService.updateBalance(balance);
    this.balanceSharedService.updateTempBalance(cartTotal);

  }

}
