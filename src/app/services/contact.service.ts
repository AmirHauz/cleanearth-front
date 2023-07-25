import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private api = 		"https://api.mailgun.net/v3/sandboxf087a8f0af134d658773090646f2e968.mailgun.org/messages"
  constructor(private http:HttpClient) { }

  PostMessage(input: any): Observable<string | null> {
    return this.http.post(this.api, input, { responseType: 'text' }).pipe(
      map((response) => {
        if (response) {
          return response;
        }
        // Return a default value in case the response is falsy.
        return null;
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error here if needed, and return an observable with a default value or throw the error again.
        console.error('Error occurred:', error);
        // Return an observable with a default value (or re-throw the error if desired).
        return of(null);
      })
    );
  }
}
