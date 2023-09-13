
import { TakenCupon } from 'src/app/models/taken-cupon';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CuponService } from 'src/app/services/cupon.service';
import { GiftService } from 'src/app/services/gift.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.html',
  styleUrls: ['./transaction-dialog.scss'],
})
export class TransactionDialogComponent {

  cupon$!: Observable<TakenCupon[]>;
  loggedValue$!: Observable<boolean>;

  formData: any = {};
  cartItems: TakenCupon[] = [];
  constructor(
    private authService : AuthService,
    private cuponService: CuponService,
    private giftService: GiftService,
    public dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { uniqueId: string, id: string },
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef

  ) {}



  onNoClick(): void {
    this.dialogRef.close();
  }

  useGift(formData: any) {
    this.authService.accessToken$.subscribe(accessToken => {
    // Assuming you have collected the necessary data from your form inputs.
    // Create the request data object as needed.
    const requestData = {
      // Include the data you need for the POST request.
      shop: formData.shop,
      code: formData.code,
      id: this.data.id
    };

    this.giftService.useGift(requestData,accessToken).subscribe(
      () => {
        // Handle success, e.g., show a success message
        console.log('Gift was used successfully');
        // Close the dialog
        this.dialogRef.close();
        this.toastr.success('Gift was used successfully', 'Success');
        // Convert this.data.id to a number and then remove the item from cartItems
        // Remove the item from the cart using the shared service
        this.cuponService.removeItemFromCart(Number(this.data.id));
      },
      (error) => {
        this.toastr.error('Error while using the gift', 'Error');
        // Handle error, e.g., show an error message
        console.error('Error using gift:', error);
        // You can also check the error status here and show an appropriate message.
      }
    );
    });
  }
}
