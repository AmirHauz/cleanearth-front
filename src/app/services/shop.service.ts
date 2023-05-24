import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private readonly MYSERVER = 'http://127.0.0.1:8000/rewards/';
  constructor(private http: HttpClient) { }

  getrewards(token$: Observable<string>) {
    return token$.pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
        return this.http.get<any[]>(this.MYSERVER, { headers });
      })
    );
  }

}
