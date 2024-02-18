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
      const storedUsername = localStorage.getItem('username');
      if (storedUsername ) {
        this.userValue$ = new Observable<string>((observer) => {
          observer.next(storedUsername);
        });
      } else {
        this.userValue$ = this.authService.userName$;
      }
    }
}
