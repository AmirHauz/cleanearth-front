import { Component, OnDestroy, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BalanceService } from 'src/app/services/balance.service';
import { AsyncPipe } from '@angular/common';
import { Balance } from 'src/app/models/balance.model ';
import { BalanceSharedService } from 'src/app/services/balance-shared.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-my-nav-bar',
  templateUrl: './my-nav-bar.component.html',
  styleUrls: ['./my-nav-bar.component.scss']
})
export class MyNavBarComponent implements OnInit, OnDestroy {
  counter: number = 0;
  tempBalance = 0;
  loggedValue$!: Observable<boolean>;
  userValue$!: Observable<string>;
  balance$!: Observable<number>;
  tempBalance$!: Observable<number>;
  accessToken$!: Observable<string>;
  isAdmin$!:Observable<boolean>;
  balanceSubscription?: Subscription;
  cartCountSubscription?:Subscription;
  counter$!:Observable<number>;

  constructor(
    private authService: AuthService,
    private balanceService: BalanceService,
    private balanceSharedService: BalanceSharedService,
    private cartService: CartService,
    private cdr:ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loggedValue$ = this.authService.logged$;
    this.accessToken$ = this.authService.accessToken$;
    

    // Retrieve the user's name from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername ) {
      this.userValue$ = new Observable<string>((observer) => {
        observer.next(storedUsername);
      });
    } else {
      this.userValue$ = this.authService.userName$;
    }

    const isAdmin: boolean = localStorage.getItem('isAdmin') == 'true' ? true : false;
    if (storedUsername ) {
      this.isAdmin$ = new Observable<boolean>((observer) => {
        observer.next(isAdmin);
      });
    } else {
      this.isAdmin$=this.authService.userIsAdmin$
    }

    this.balance$ = this.balanceSharedService.balance$;
    this.tempBalance$ = this.balanceSharedService.tempBalance$;
    this.counter$ = this.cartService.CartCount$;

    // Subscribe to balance$ and update tempBalance when it emits a new value
    if (storedUsername) {
      this.balanceSubscription = this.balance$.subscribe(
        (balance: number) => {
          this.tempBalance = balance;
          console.log("the balance in navbar is::::::::::", balance)
        }
      );

    }
    if (storedUsername) {
      // Subscribe to this.cartService.CartCount$ and update this.counter when it emits a new value
      this.cartCountSubscription = this.cartService.CartCount$.subscribe((count) => {
        this.counter = count;
        console.log("the counter in navbar is::::::::::", count);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.balanceSubscription) {
      this.balanceSubscription.unsubscribe();
    }
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
    }
  }


  logout() {
    // Logout functionality
    console.log("logout pressed")
    this.authService.logout()

  }

}



