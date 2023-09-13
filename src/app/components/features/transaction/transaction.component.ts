import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TakenCupon } from 'src/app/models/taken-cupon';
import { AuthService } from 'src/app/services/auth.service';
import { CuponService } from 'src/app/services/cupon.service';
import { Router } from '@angular/router';
import { TransactionDialogComponent } from './transaction-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {

  loggedValue$!: Observable<boolean>;
  cupon$!: Observable<TakenCupon[]>;
  filteredCupons: TakenCupon[] = [];

  constructor(
    public dialog: MatDialog,
    private authService : AuthService,
    private cuponService: CuponService,
    private router:Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
      this.loggedValue$= this.authService.logged$;
      this.loggedValue$.subscribe(loggedIn => {
        if (loggedIn) {
          this.authService.accessToken$.subscribe(accessToken => {
            this.authService.userId$.subscribe(userId => {
              if (accessToken && userId) {
                this.cupon$ = this.cuponService.getCupons(userId, accessToken);
                this.cupon$.subscribe((cuponItems) => {
                  this.filteredCupons = cuponItems.filter((item) => item.status === 'CREATED');
                });
              }
            });
          });
        }
      });
    }

    openDialog(
      enterAnimationDuration: string,
      exitAnimationDuration: string,
      uniqueId: string,
      id: number
    ): void {
      const dialogRef = this.dialog.open(TransactionDialogComponent, {
        width: '500px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: { uniqueId, id },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'success') {
          const indexToRemove = this.filteredCupons.findIndex((coupon) => coupon.uniqueId === uniqueId);
          if (indexToRemove !== -1) {
            this.filteredCupons.splice(indexToRemove, 1);
          }
          this.toastr.success('Gift was used successfully', 'Success');
          this.cdr.detectChanges();
        } else if (result === 'error') {
          this.toastr.error('Error while using the gift', 'Error');
        }
      });
    }

    removeItem(itemId: number) {
      this.cuponService.removeItemFromCart(itemId);
    }
  }
