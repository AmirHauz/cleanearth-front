import { Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartItemDisplay, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
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

  constructor(

    private authService : AuthService,
    private cartService: CartService,
    private balanceSharedService: BalanceSharedService,
    private router:Router,
    ) {}

    ngOnInit(): void {
      this.loggedValue$= this.authService.logged$;
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
        total: itemDisplay.total * (itemDisplay.amount + 1),
        reward: itemDisplay.reward.id,
        amount: itemDisplay.amount + 1
      }
      itemDisplay.amount += 1; // Locally increment the amount
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
          }
        );
      });
    }

    decreaseCartItemAmount(itemDisplay: CartItemDisplay) {
      const item: CartItem = {
        id: itemDisplay.id,
        total: itemDisplay.total * (itemDisplay.amount - 1),
        reward: itemDisplay.reward.id,
        amount: itemDisplay.amount - 1
      }
      itemDisplay.amount -= 1; // Locally increment the amount
      this.authService.accessToken$.subscribe(accessToken => {
        this.cartService.updateCartItemAmount(item, accessToken).subscribe(
          () => {
            console.log('Item amount decreased successfully on the server.');
            this.authService.getAllDetails();
          },
          error => {
            console.error('Error increasing item amount on the server:', error);
            // Restore the local amount if the server update fails
            itemDisplay.amount += 1;
          }
        );
      });
    }
  }
