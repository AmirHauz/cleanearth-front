import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartItem, CartItemDisplay } from '../models/cart.model';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { TakenCupon } from '../models/taken-cupon';

@Injectable({
  providedIn: 'root'
})
export class CuponService {
  private readonly MYSERVER = 'http://127.0.0.1:8000/cupon/';
  constructor(private http: HttpClient) { }

  private cartItems: TakenCupon[] = [];
  takeCupon(item: CartItemDisplay, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.http.post(`${this.MYSERVER}`, { item },{headers:headers});
  }

  public getCupons(userId: number,token: string): Observable<TakenCupon[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get<TakenCupon[]>(`${this.MYSERVER}`, { headers: headers }).pipe(
      catchError(error => throwError(error))
    );
  }

  removeItemFromCart(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }
}
