import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BalanceService } from 'src/app/services/balance.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-my-nav-bar',
  templateUrl: './my-nav-bar.component.html',
  styleUrls: ['./my-nav-bar.component.scss']
})
export class MyNavBarComponent implements OnInit {
  counter = 0;
  balance=0
  loggedValue$!: Observable<boolean>;
  userValue$!:Observable<string> ;
  tempBalance$!:Observable<number>;

  constructor(
    private router: Router,
    private authService : AuthService,
    private balanceService : BalanceService,
    ) {}

  ngOnInit(): void {
    this.loggedValue$= this.authService.logged$;
    console.log(this.loggedValue$);
    this.userValue$= this.authService.userName$
      console.log(this.userValue$);
      this.tempBalance$ = this.balanceService.tempBalance$
  }
  logout() {
    // Logout functionality
    console.log("logout pressed")
    this.authService.logout()
  }
}



