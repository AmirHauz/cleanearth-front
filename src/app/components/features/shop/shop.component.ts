import { Component } from '@angular/core';
import { map, Observable, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ShopService } from 'src/app/services/shop.service';
import { BalanceService } from 'src/app/services/balance.service';
import { Balance } from 'src/app/models/balance.model ';
import { BalanceSharedService } from 'src/app/services/balance-shared.service';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {



  loggedValue$!: Observable<boolean>;
  balance$!: Observable<number>;
  tempBalance$!: Observable<number>;
  cupons:any[]=[];
  accessToken$!: Observable<string>;
  constructor(

    private balanceService : BalanceService,
    private authService : AuthService,
    private shopService:ShopService,
    private balanceSharedService: BalanceSharedService,

    ) {   }

    ngOnInit(): void {
      this.loggedValue$= this.authService.logged$;
      this.accessToken$ = this.authService.accessToken$;

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

      this.balance$ = this.balanceSharedService.balance$;
      this.tempBalance$ = this.balanceSharedService.tempBalance$;

      this.retrieveBalance();

      this.shopService.getrewards(this.accessToken$).subscribe(
        (response) => {
          this.cupons = response;
          // console.log(this.cupons);
        },
        (error) => {
          // console.error(error);
        }
      );


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
    }
