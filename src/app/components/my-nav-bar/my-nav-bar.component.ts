import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BalanceService } from 'src/app/services/balance.service';
import { AsyncPipe } from '@angular/common';
import { Balance } from 'src/app/models/balance.model ';

@Component({
  selector: 'app-my-nav-bar',
  templateUrl: './my-nav-bar.component.html',
  styleUrls: ['./my-nav-bar.component.scss']
})
export class MyNavBarComponent implements OnInit {
  counter = 0;
  tempBalance = 0;
  loggedValue$!: Observable<boolean>;
  userValue$!: Observable<string>;
  balance$!: Observable<number>;
  accessToken$!: Observable<string>;
  
  private balanceSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService : AuthService,
    private balanceService : BalanceService,
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

   this.balanceService.getBalance(this.accessToken$).subscribe(
    (balance: Balance) => {
      this.balanceService.updateBalance(balance.balance);
      this.balanceService.updateTempBalance(balance.tempBalance);
      console.log("Response for balance:", balance.balance);
    },
    (error) => {
      console.error("Error occurred while fetching balance:", error);
    }
  );

  this.balance$ = this.balanceService.balance$;

  // Subscribe to balance$ and update tempBalance when it emits a new value
  this.balanceSubscription = this.balance$.subscribe(
    (balance: number) => {
      this.tempBalance = balance;
    }
  );
}

ngOnDestroy(): void {
  if (this.balanceSubscription) {
    this.balanceSubscription.unsubscribe();
  }
}

  logout() {
    // Logout functionality
    console.log("logout pressed")
    this.authService.logout()

  }

}



