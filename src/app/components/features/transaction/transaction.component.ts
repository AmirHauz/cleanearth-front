import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TakenCupon } from 'src/app/models/taken-cupon';
import { AuthService } from 'src/app/services/auth.service';
import { CuponService } from 'src/app/services/cupon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent {

  loggedValue$!: Observable<boolean>;
  cupon$!: Observable<TakenCupon[]>;

  constructor(

    private authService : AuthService,
    private cuponService: CuponService,
    private router:Router,
    ) {}

    ngOnInit(): void {
      this.loggedValue$= this.authService.logged$;
      this.loggedValue$.subscribe(loggedIn => {
        if (loggedIn) {
          this.authService.accessToken$.subscribe(accessToken => {
            this.authService.userId$.subscribe(userId => {
              if (accessToken && userId) {
                this.cupon$ = this.cuponService.getCupons(userId, accessToken);
              }
            });
          });
        }
      });
    }
}
