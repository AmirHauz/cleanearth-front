import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clean_earth';

  constructor(private authService:AuthService){}

  ngOnInit(): void {
    this.authService.loadUserDataOnRefresh();
  }
}

