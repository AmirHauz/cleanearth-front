import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError ,Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private MYSERVER = 'http://127.0.0.1:8000/contactus/';

  constructor(private http:HttpClient) { }

  public PostMessage(input: any,  token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.http.post(this.MYSERVER, input, { headers: headers }).pipe(
      catchError(error => throwError(error))
    );
  }
}
