import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TakenCupon } from 'src/app/models/taken-cupon';
import { AuthService } from 'src/app/services/auth.service';
import { CuponService } from 'src/app/services/cupon.service';
import { Router } from '@angular/router';
import { TransactionDialogComponent } from './transaction-dialog';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {

  loggedValue$!: Observable<boolean>;
  cupon$!: Observable<TakenCupon[]>;

  constructor(
    public dialog: MatDialog,
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

    openDialog(enterAnimationDuration: string, exitAnimationDuration: string,uniqueId: string, id: number): void {
      this.dialog.open(TransactionDialogComponent, {
        width: '500px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: { uniqueId, id }
      });
}

}
