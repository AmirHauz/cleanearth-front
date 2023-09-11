
import { TakenCupon } from 'src/app/models/taken-cupon';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CuponService } from 'src/app/services/cupon.service';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.html',
  styleUrls: ['./transaction-dialog.scss'],
})
export class TransactionDialogComponent {

  cupon$!: Observable<TakenCupon[]>;
  loggedValue$!: Observable<boolean>;

  constructor(
    private authService : AuthService,
    private cuponService: CuponService,
    public dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { uniqueId: string, id: string }
  ) {}



  onNoClick(): void {
    this.dialogRef.close();
  }
}
