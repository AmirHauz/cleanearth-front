import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GiftService {

  private readonly MYSERVER = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) { }

  useGift(data: any,token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    const url = `${this.MYSERVER}useGift/`; // Adjust the URL to your backend endpoint
    return this.http.post(url, data, { headers: headers });
  }
}
