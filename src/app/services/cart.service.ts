import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartItem, CartItemDisplay } from '../models/cart.model';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  private readonly MYSERVER = 'http://127.0.0.1:8000/item/';
  constructor(private http: HttpClient) { }

  // addToCart(item: CartItem, token: string ): Observable<string | undefined> {
  //   // Update the local cart first
  //   const currentCartItems = this.cartItemsSubject.value;
  //   const updatedCartItems = [...currentCartItems, item];
  //   this.cartItemsSubject.next(updatedCartItems);

  //   // Now, send the updated cart to the server
  //   this.updateCartOnServer(updatedCartItems, token).subscribe(
  //     response => {
  //       console.log('Cart updated on server:', response);
  //     },
  //     error => {
  //       console.error('Error updating cart on server:', error);
  //     }
  //   );
  // }

  updateCartOnServer(cartItems: CartItem[], token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.http.post(`${this.MYSERVER}`, { cartItems },{headers:headers});
  }

  public getItems(userId: number,token: string): Observable<CartItemDisplay[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get<CartItemDisplay[]>(`${this.MYSERVER}`, { headers: headers }).pipe(
      catchError(error => throwError(error))
    );
  }

  deleteCartItem(itemId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.delete(`${this.MYSERVER}${itemId}`, { headers: headers });
  }

  updateCartItemAmount(item: CartItem, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.http.put(`${this.MYSERVER}`, item, { headers: headers });
  }
}
