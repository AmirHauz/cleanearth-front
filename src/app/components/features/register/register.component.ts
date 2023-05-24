import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  error!: string;
  success!: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,

  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  onRegisterSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const username = this.registerForm.get('username')?.value;
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;

    this.authService.register(username, email, password).subscribe(
      (      data: any) => {
        this.success = 'Registration successful, please login.';
        this.registerForm.reset();
      },
      (      error: { error: { message: string; }; }) => {
        this.error = error.error.message;
      }
    );
  }
}
