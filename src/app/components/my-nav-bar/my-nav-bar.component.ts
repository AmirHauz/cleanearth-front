import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BalanceService } from 'src/app/services/balance.service';
import { AsyncPipe } from '@angular/common';
import { Balance } from 'src/app/models/balance.model ';
import { BalanceSharedService } from 'src/app/services/balance-shared.service';
@Component({
  selector: 'app-my-nav-bar',
  templateUrl: './my-nav-bar.component.html',
  styleUrls: ['./my-nav-bar.component.scss']
})
export class MyNavBarComponent implements OnInit,OnDestroy {
  counter = 0;
  tempBalance = 0;
  loggedValue$!: Observable<boolean>;
  userValue$!: Observable<string>;
  balance$!: Observable<number>;
  tempBalance$!: Observable<number>;
  accessToken$!: Observable<string>;

  private balanceSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService : AuthService,
    private balanceService : BalanceService,
    private balanceSharedService: BalanceSharedService,
    ) {}

  ngOnInit(): void {

    this.loggedValue$= this.authService.logged$;
    console.log(this.loggedValue$);
    this.accessToken$ = this.authService.accessToken$;

    // Retrieve the user's name from local storage
   const storedUsername = localStorage.getItem('username');
   if (storedUsername) {
     this.userValue$ = new Observable<string>((observer) => {
       observer.next(storedUsername);
     });
   } else {
     this.userValue$ = this.authService.userName$;
   }

   if (storedUsername) {
    console.log("sanja" + storedUsername)
    this.balanceService.getBalance(this.accessToken$).subscribe(
      (balance: Balance) => {
        this.balanceSharedService.updateBalance(balance.balance);
        this.balanceSharedService.updateTempBalance();
        console.log("Response for balance:", balance.balance);
      },
      (error) => {
        console.error("Error occurred while fetching balance:", error);
      }
    );
   }

  this.balance$ = this.balanceSharedService.balance$;
  this.tempBalance$ = this.balanceSharedService.tempBalance$;

  // Subscribe to balance$ and update tempBalance when it emits a new value
     if (storedUsername) {
      this.balanceSubscription = this.balance$.subscribe(
        (balance: number) => {
          this.tempBalance = balance;
          console.log("the balance is::::::::::",balance)
        }
      );
      this.retrieveBalance();
     }
}

ngOnDestroy(): void {
  if (this.balanceSubscription) {
    this.balanceSubscription.unsubscribe();
  }
}

private retrieveBalance(): void {
  this.balanceService.getBalance(this.accessToken$).subscribe(
    (balance: Balance) => {
      this.balanceSharedService.updateBalance(balance.balance);
      this.balanceSharedService.updateTempBalance();
      console.log("Response for balance:", balance.balance);
    },
    (error) => {
      console.error("Error occurred while fetching balance:", error);
    }
  );
}
  logout() {
    // Logout functionality
    console.log("logout pressed")
    this.authService.logout()

  }

}



