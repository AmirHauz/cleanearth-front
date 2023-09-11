import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error!: string;
  success!: string ;
  loggedValue$!: Observable<boolean> ;
  userValue$!:Observable<string> ;
  userId$!:Observable<number>;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
    this.loggedValue$= this.authService.logged$;
    console.log(this.loggedValue$);
    this.userValue$= this.authService.userName$
      console.log(this.userValue$);
  }

  onLoginSubmit() {
    if (this.loginForm.invalid  ) {
      return;
    }

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.login(username, password).subscribe(result => {
      console.log('Authentication response:', result.loginResponse);
      console.log('User details: login component ', result.userDetails);
      this.authService.getAllDetails();

      this.router.navigate(['/home']);
    });
  }
}
