import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  loggedValue$!: Observable<boolean>;

  constructor(

    private authService : AuthService
    ) {}

    ngOnInit(): void {
      this.loggedValue$= this.authService.logged$;


    }
}
