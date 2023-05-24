import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  loggedValue$!: Observable<boolean>;
  userValue$!:Observable<string> ;

  constructor(

    private authService : AuthService
    ) {}

    ngOnInit(): void {
      this.loggedValue$ = this.authService.logged$;
      this.userValue$ = this.authService.userName$
    }
}
