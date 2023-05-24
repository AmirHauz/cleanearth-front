import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly MYSERVER = 'http://127.0.0.1:8000/profile/';
  constructor(private http: HttpClient) { }


  public profile(userId: number, fullName: string, aboutMe: string, dateOfBirth: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    const data = { userId, fullName, aboutMe, dateOfBirth };

    console.log("user id is : ", userId)
    return this.http.put(`${this.MYSERVER}${userId}`, data, { headers: headers }).pipe(
      catchError(error => throwError(error))
    );
  }
  public getProfile(userId: number,token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get(`${this.MYSERVER}`, { headers: headers }).pipe(
      catchError(error => throwError(error))
    );


  }
}
