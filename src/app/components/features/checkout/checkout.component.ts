import { Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartItemDisplay, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { CuponService } from 'src/app/services/cupon.service';
import { BalanceSharedService } from 'src/app/services/balance-shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  loggedValue$!: Observable<boolean>;
  cart$!: Observable<CartItemDisplay[]>;
  tempBalance$!: Observable<number>;
  counter$!: Observable<number>;

  constructor(

    private authService: AuthService,
    private cartService: CartService,
    private cuponService: CuponService,
    private balanceSharedService: BalanceSharedService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loggedValue$ = this.authService.logged$;
    this.tempBalance$ = this.balanceSharedService.tempBalance$;
    this.loggedValue$.subscribe(loggedIn => {
      if (loggedIn) {
        this.authService.accessToken$.subscribe(accessToken => {
          this.authService.userId$.subscribe(userId => {
            if (accessToken && userId) {
              this.cart$ = this.cartService.getItems(userId, accessToken);
            }
          });
        });
      }
    });
    this.cart$.subscribe((cartItems) => {
      const count = cartItems.reduce((sum, item) => sum + item.amount, 0);
      this.cartService.setCartCount(count);
    });

  }

  deleteCartItem(itemId: number) {
    this.authService.accessToken$.subscribe(accessToken => {
      this.cartService.deleteCartItem(itemId, accessToken).subscribe(
        () => {
          // Item deleted successfully, you might want to update the cart display
          console.log('Item deleted successfully.');
          this.authService.getAllDetails();
          this.cart$ = this.cart$.pipe(
            map(items => items.filter(item => item.id !== itemId))
          );
        },
        error => {
          console.error('Error deleting item:', error);
        }
      );
    });
  }

  increaseCartItemAmount(itemDisplay: CartItemDisplay) {
    const item: CartItem = {
      id: itemDisplay.id,
      total: itemDisplay.reward.cuponPrice * (itemDisplay.amount + 1),
      reward: itemDisplay.reward.id,
      amount: itemDisplay.amount + 1
    }
    itemDisplay.amount += 1;
    itemDisplay.total += itemDisplay.reward.cuponPrice
    this.authService.accessToken$.subscribe(accessToken => {
      this.cartService.updateCartItemAmount(item, accessToken).subscribe(
        () => {
          console.log('Item amount increased successfully on the server.');
          this.authService.getAllDetails();

        },
        error => {
          console.error('Error increasing item amount on the server:', error);
          // Restore the local amount if the server update fails
          itemDisplay.amount -= 1;
          this.cartService.CartCount$
        }
      );
    });
  }

  decreaseCartItemAmount(itemDisplay: CartItemDisplay) {
    const item: CartItem = {
      id: itemDisplay.id,
      total: itemDisplay.reward.cuponPrice * (itemDisplay.amount - 1),
      reward: itemDisplay.reward.id,
      amount: itemDisplay.amount - 1
    }
    itemDisplay.amount -= 1;
    itemDisplay.total -= itemDisplay.reward.cuponPrice
    this.authService.accessToken$.subscribe(accessToken => {
      this.cartService.updateCartItemAmount(item, accessToken).subscribe(
        () => {
          console.log('Item amount decreased successfully on the server.');
          this.authService.getAllDetails();
          this
        },
        error => {
          console.error('Error increasing item amount on the server:', error);
          // Restore the local amount if the server update fails
          itemDisplay.amount += 1;
        }
      );
    });
  }

  takeCupon(item: CartItemDisplay) {
    this.authService.accessToken$.subscribe(accessToken => {
      this.cuponService.takeCupon(item, accessToken).subscribe(
        () => {
          // Item deleted successfully, you might want to update the cart display
          this.authService.getAllDetails();
          this.cart$ = this.cart$.pipe(
            map(items => items.filter(it => it.id !== item.id))
          );
        },
        error => {
          console.error('Error deleting item:', error);
        }
      );
    });
  }
}
