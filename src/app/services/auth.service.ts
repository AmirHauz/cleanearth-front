import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, forkJoin } from 'rxjs';
import { catchError, tap, map, timeInterval, switchMap } from 'rxjs/operators';
import { Balance } from 'src/app/models/balance.model ';
import { BalanceSharedService } from 'src/app/services/balance-shared.service';
import { BalanceService } from 'src/app/services/balance.service';
import { CartService } from 'src/app/services/cart.service'
import { DayViewModel } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
interface AuthResponse {
  access: string;
  refresh: string;
}

interface UserDetailsResponse {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
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
  private userEmailSubject = new BehaviorSubject<string>("");
  private userIsAdminSubject = new BehaviorSubject<boolean>(false);
  private userIdSubject = new BehaviorSubject<number>(1);
  balance$!: Observable<number>;
  tempBalance$!: Observable<number>;


  get userIsAdmin$(): Observable<boolean> {
    return this.userIsAdminSubject.asObservable();
  }

  get logged$(): Observable<boolean> {
    return this.loggedSubject.asObservable();
  }

  get userName$(): Observable<string> {
    return this.userNameSubject.asObservable();
  }

  get userEmail$(): Observable<string> {
    return this.userEmailSubject.asObservable();
  }

  get userId$(): Observable<number> {
    return this.userIdSubject.asObservable();
  }

  get accessToken$(): Observable<string> {
    return this.accessTokenSubject.asObservable();
  }

  constructor(private http: HttpClient,
    private balanceService: BalanceService,
    private cartService: CartService,
    private balanceSharedService: BalanceSharedService
  ) {
    this.accessTokenSubject.next(this.getAccessToken());

    this.accessTokenSubject.subscribe(token => {
      console.log('AccessTokenSubject value:', token);
      this.loggedSubject.next(!!token);
    });

  }

  private getAccessToken(): string {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY) ?? "";
  }

  private setAccessToken(token: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    console.log("Service - Access token set:", token);
    this.accessTokenSubject.next(token);
  }

  private setUserName(username: string): void {
    sessionStorage.setItem('username', username);
    this.userNameSubject.next(username);
  }

  private setUserEmail(email: string): void {
    sessionStorage.setItem('email', email);
    this.userEmailSubject.next(email);
  }

  private setUserIsAdmin(is_superuser: boolean): void {
    sessionStorage.setItem('isAdmin', is_superuser ? 'true' : 'false');
    console.log("is superuser??????????????", is_superuser)
    this.userIsAdminSubject.next(is_superuser);
  }

  private getRefreshToken(): string {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY) ?? "";
  }

  private setRefreshToken(token: string): void {
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  private clearTokens(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('isAdmin');

    // this.accessTokenSubject.next("");
    this.loggedSubject.next(false)
    this.userNameSubject.next("")
  }

  public register(username: string, email: string, password: string): Observable<any> {
    const url = `${this.MYSERVER}/register/`;
    const data = { username, email, password };
    console.log("username:", data.username)
    console.log("email:", data.email)
    console.log("pass:", data.password)
    return this.http.post(url, data).pipe(
      catchError(error => throwError(error))
    );
  }

  public login(username: string, password: string): Observable<any>{
    let userDetails;
    const url = `${this.MYSERVER}/login/`;
    const data = { username, password };
    return this.http.post<AuthResponse>(url, data).pipe(
      tap(loginResponse => {
        console.log('Login response:', loginResponse);
        this.setAccessToken(loginResponse.access);
        this.setRefreshToken(loginResponse.refresh);
        this.loggedSubject.next(true);
      }),
      switchMap(loginResponse => {
        // After the first call is complete, make the second HTTP call to get user details
        const userDetailsUrl = `${this.MYSERVER}/userDetail/${username}`;
        return this.http.get<UserDetailsResponse>(userDetailsUrl).pipe(
          tap(userDetails => {
            this.userIdSubject.next(userDetails.id);
            this.setUserName(userDetails.username);
            this.setUserEmail(userDetails.email);
            this.setUserIsAdmin(userDetails.is_superuser);
          }),
          catchError(error => throwError(error))
        );
      }),
      map(userDetails => {
        console.log('User details:', userDetails);
        return userDetails; // Return the user details
      }),
      catchError(error => throwError(error))
    );
  }

  public getAllDetails() {
    this.balanceService.getBalance(this.accessToken$).subscribe(
      (balance: Balance) => {
        // this.balanceSharedService.updateBalance(balance.balance);
        // this.balanceSharedService.updateTempBalance(0);
        console.log("Response for balance :", balance.balance);
      },
      (error) => {
        console.error("Error occurred while fetching balance:", error);
      }
    );
    this.cartService.CartCount$.subscribe(
      (counter: number) => {
        // Here, 'counter' will contain the value from the cart service.
        console.log("Cart Count:", counter);
      },
      (error) => {
        console.error("Error occurred while fetching cart count:", error);
      }
    );
  }

  public logout(): void {
    this.clearTokens();
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.userNameSubject.next("");
    this.userEmailSubject.next("");
    this.loggedSubject.next(false);
    this.userIsAdminSubject.next(false)
    this.balanceSharedService.clearBalanceData();
  }

  public loadUserDataOnRefresh() {
    if (this.getAccessToken()) {
      // Fetch user data and set observables
      // You can call the necessary methods here to load user data and admin status

      // Subscribe to userIsAdmin$ and log its value
      this.userIsAdmin$.subscribe(isAdmin => {
        console.log("userIsAdmin$ value:", isAdmin);
      });

      // Call your methods here to load user data and admin status
      this.getAllDetails();
    }
  }

  public refreshAccessToken(): Observable<AuthResponse> {
    const url = `${this.MYSERVER}/token/refresh/`;
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    //  'access': accessToken,
    });

    return this.http.post<AuthResponse>(url, {refresh:refreshToken}, { headers }).pipe(
      tap(response => {
        console.log('resopnse', response)
        this.setAccessToken(response.access);
      }),
      catchError(error => {
        console.log('err', error);
    //    this.clearTokens();
        return throwError(error);
      })
    );
  }

}
