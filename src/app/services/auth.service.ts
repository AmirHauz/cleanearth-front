import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError,  forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


interface AuthResponse {
  access: string;
  refresh: string;
}

interface UserDetailsResponse {
  id: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly MYSERVER = 'http://127.0.0.1:8000';
  private readonly ACCESS_TOKEN_KEY = 'access';
  private readonly REFRESH_TOKEN_KEY = 'refresh';

  private accessTokenSubject = new BehaviorSubject<string>("");

  private loggedSubject = new BehaviorSubject<boolean>(false);
  private userNameSubject = new BehaviorSubject<string>("");
  private userIdSubject = new BehaviorSubject<number>(1);


  get logged$():Observable<boolean>{
    return this.loggedSubject.asObservable();
  }

  get userName$():Observable<string>{
    return this.userNameSubject.asObservable();
  }

  get userId$():Observable<number>{
    return this.userIdSubject.asObservable();
  }

  get accessToken$():Observable<string>{
    return this.accessTokenSubject.asObservable();
  }

  constructor(private http: HttpClient) {
    this.accessTokenSubject.next(this.getAccessToken());

    this.accessTokenSubject.subscribe(token => {
      console.log('AccessTokenSubject value:', token);
      this.loggedSubject.next(!!token);
    });
  }

  private getAccessToken(): string  {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) ?? "";
  }

  private setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    console.log("Service - Access token set:", token);
    this.accessTokenSubject.next(token);
  }

  private setUserName(username: string): void {
    localStorage.setItem('username', username);
    this.userNameSubject.next(username);
  }
  private getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) ?? "";
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);


  }

  private clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem('username');
    // this.accessTokenSubject.next("");
    this.loggedSubject.next(false)
    this.userNameSubject.next("")
    }



  public register(username: string, email:string, password: string): Observable<any> {
    const url = `${this.MYSERVER}/register/`;
    const data = { username, email, password };
    console.log("username:", data.username)
    console.log("email:", data.email)
    console.log("pass:", data.password)
    return this.http.post(url, data).pipe(
      catchError(error => throwError(error))
    );
  }

  public login(username: string, password: string): Observable<any> {
    const url = `${this.MYSERVER}/login/`;
    const data = { username, password };
    const loginResponse = this.http.post<AuthResponse>(url, data).pipe(
      tap(response => {
        console.log('Login response:', response); // Add this line
        this.setAccessToken(response.access);
        this.setRefreshToken(response.refresh);
        this.loggedSubject.next(true);
        this.userNameSubject.next(username);
        // Store the username in local storage
        this.setUserName(username);
      }),
      catchError(error => throwError(error))
    );

  const userDetails = this.http.get<UserDetailsResponse>(this.MYSERVER + '/userDetail/' + username).pipe(
    tap(response => {
      this.userIdSubject.next(response.id);
    }),
    catchError(error => throwError(error))
  );

  return forkJoin([loginResponse, userDetails]).pipe(
    tap(([response, userDetails]) => {
      console.log('Authentication response:', response);
      console.log('User details:', userDetails);
    }),
    catchError(error => throwError(error))
  );
}
  public logout(): void {
    this.clearTokens();
    this.userNameSubject.next("");
    this.loggedSubject.next(false)
  }

  // public isLoggedIn(): boolean {
  //   const token = this.getAccessToken();
  //   return token !== null && !this.isTokenExpired(token);
  // }

  // private isTokenExpired(token: string): any {
  //   const decoded = jwt_decode(token);
  //   console.log(decoded)
    // const expirationDate = new Date(decoded.exp* 1000);
    // return expirationDate < new Date();
  // }

  // public refreshAccessToken(): Observable<string> {
  //   const url = `${this.MYSERVER}/token/refresh/`;
  //   const refreshToken = this.getRefreshToken();
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${refreshToken}`
  //   });
  //   return this.http.post<AuthResponse>(url, null, { headers }).pipe(
  //     switchMap(response => {
  //       this.setAccessToken(response.accessToken);
  //       return this.accessTokenSubject;
  //     }),
  //     catchError(error => {
  //       this.clearTokens();
  //       return throwError(error);
  //     })
  //   );
  // }

}
