import { Component } from '@angular/core';
import { map, Observable, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ShopService } from 'src/app/services/shop.service';
import { BalanceService } from 'src/app/services/balance.service';
import { Balance } from 'src/app/models/balance.model ';
import { BalanceSharedService } from 'src/app/services/balance-shared.service';
import { CartService} from'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cart.model';
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
    private cartService: CartService,
    ) {   }

  ngOnInit(): void {
    this.loggedValue$= this.authService.logged$;
    this.accessToken$ = this.authService.accessToken$;

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
        console.log("Response for balance:", balance.balance);
      },
      (error) => {
        console.error("Error occurred while fetching balance:", error);
      }
    );
  }

  addToCart(item: any): void {
    const itemPrice: number = item.cuponPrice;
        if (item["amount"] === undefined || item["amount"] === null) {
          item.amount = 1
        }
         const cartItem: CartItem = {

          reward: item.id,
          amount: item.amount,
          total: itemPrice * item.amount
        };
        this.authService.accessToken$.pipe(
          take(1),
          switchMap((token: any) => {
            return this.cartService.updateCartOnServer([cartItem], token);
          })
        ).subscribe(()=> {
          console.log("success sending to the server")
          this.authService.getAllDetails();
          }
        )

        // Update the temporary balance with the calculated value
        this.balanceSharedService.updateTempBalance(itemPrice);

        console.log('Item added to cart:', cartItem);
    //   } else {
    //     console.log('Insufficient balance to add item to cart.');
    // });
  }
}
