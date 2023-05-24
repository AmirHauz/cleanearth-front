import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-history',
  templateUrl: './my-history.component.html',
  styleUrls: ['./my-history.component.scss']
})
export class MyHistoryComponent {
  loggedValue$!: Observable<boolean>;

  constructor(

    private authService : AuthService
    ) {}

    ngOnInit(): void {
      this.loggedValue$= this.authService.logged$;


    }
}
