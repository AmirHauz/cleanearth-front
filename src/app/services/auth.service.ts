import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError,  forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Balance } from 'src/app/models/balance.model ';
import { BalanceSharedService } from 'src/app/services/balance-shared.service';
import { BalanceService } from 'src/app/services/balance.service';
import { CartService} from 'src/app/services/cart.service'
interface AuthResponse {
  access: string;
  refresh: string;
}

interface UserDetailsResponse {
  id: number;
  username: string;
  email:string;
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


  get userIsAdminl$():Observable<boolean>{
    console.log("user is admin subject:!!!!!!!!!!!!!!!!!!!!!!!!",this.userIsAdminSubject.asObservable())
    return this.userIsAdminSubject.asObservable();
  }

  get logged$():Observable<boolean>{
    return this.loggedSubject.asObservable();
  }

  get userName$():Observable<string>{
    return this.userNameSubject.asObservable();
  }

  get userEmail$():Observable<string>{
    return this.userEmailSubject.asObservable();
  }

  get userId$():Observable<number>{
    return this.userIdSubject.asObservable();
  }

  get accessToken$():Observable<string>{
    return this.accessTokenSubject.asObservable();
  }

  constructor(private http: HttpClient,
    private balanceService : BalanceService,
    private cartService:CartService,
    private balanceSharedService: BalanceSharedService
    ) {
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

  private setUserEmail(email: string): void {
    localStorage.setItem('email', email);
    this.userEmailSubject.next(email);
  }

  private setUserIsAdmin(is_superuser: boolean): void {
    localStorage.setItem('isAdmin', is_superuser ? 'true' : 'false');
    console.log("is superuser??????????????", is_superuser)
    this.userIsAdminSubject.next(is_superuser);
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
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');

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
        console.log("access token in login in auth service" + this.accessToken$);
      }),
      catchError(error => throwError(error))
    );

  const userDetails = this.http.get<UserDetailsResponse>(this.MYSERVER + '/userDetail/' + username).pipe(
    tap(response => {
      this.userIdSubject.next(response.id);
      this.setUserEmail(response.email); // Store the email in local storage

      this.setUserIsAdmin(response.is_superuser);
    }),
    catchError(error => throwError(error))
  );

  return forkJoin({ loginResponse, userDetails }).pipe(
    map(result => {
      console.log('Authentication response:', result.loginResponse);
      console.log('User details: auth service', result.userDetails);
      return result; // Return the result object with loginResponse and userDetails
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
  this.userNameSubject.next("");
  this.userEmailSubject.next("");
  this.loggedSubject.next(false);
   this.balanceSharedService.clearBalanceData();
}

public loadUserDataOnRefresh() {
  if (this.getAccessToken()) {
    // Fetch user data and set observables
    // You can call the necessary methods here to load user data and admin status

    // Subscribe to userIsAdmin$ and log its value
    this.userIsAdminl$.subscribe(isAdmin => {
      console.log("userIsAdmin$ value:", isAdmin);
    });

    // Call your methods here to load user data and admin status
    this.getAllDetails();
  }
}

public refreshAccessToken(): Observable<AuthResponse> {
  const url = `${this.MYSERVER}/token/refresh/`;
  const refreshToken = this.getRefreshToken();
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${refreshToken}`
  });

  return this.http.post<AuthResponse>(url, null, { headers }).pipe(
    tap(response => {
      this.setAccessToken(response.access);
    }),
    catchError(error => {
      this.clearTokens(); // Clear tokens on refresh failure
      return throwError(error);
    })
  );
}

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



}
