import { Component } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
 
  balance = 1100;

  loggedValue$!: Observable<boolean>;
  cupons:any[]=[]
  accessToken$!: Observable<string>;
  constructor(

    private authService : AuthService,
    private shopService:ShopService
    ) {   }

    ngOnInit(): void {
      this.loggedValue$= this.authService.logged$;
      this.accessToken$ = this.authService.accessToken$;
      this.shopService.getrewards(this.accessToken$).subscribe(
        (response) => {
          this.cupons = response;
          console.log(this.cupons);
        },
        (error) => {
          console.error(error);
        }
      );
      }
    }
