import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartItem, CartItemDisplay } from '../models/cart.model';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();
  private cartCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private readonly MYSERVER = 'http://127.0.0.1:8000/';
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
  // return this.http.get<Balance>(this.MYSERVER + "balance/", { headers }).pipe(
  updateCartOnServer(cartItems: CartItem[], token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.http.post(this.MYSERVER + "item/", { cartItems },{headers:headers});
  }

  public getItems(userId: number,token: string): Observable<CartItemDisplay[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get<CartItemDisplay[]>(this.MYSERVER + "item/", { headers: headers }).pipe(
      catchError(error => throwError(error))
    );
  }

  deleteCartItem(itemId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.delete(`${this.MYSERVER}item/${itemId}`, { headers: headers });
  }

  updateCartItemAmount(item: CartItem, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.http.put(this.MYSERVER + "item/", item, { headers: headers });
  }

  get CartCount$(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  setCartCount(count: number) {
    this.cartCountSubject.next(count);
  }



}
