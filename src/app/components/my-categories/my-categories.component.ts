import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-categories',
  templateUrl: './my-categories.component.html',
  styleUrls: ['./my-categories.component.scss']
})
export class MyCategoriesComponent {
  isAdmin$!:Observable<boolean>

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin$=this.authService.userIsAdminl$

  }
}
