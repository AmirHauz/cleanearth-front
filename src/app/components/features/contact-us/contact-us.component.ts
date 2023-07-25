import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ContactService } from 'src/app/services/contact.service';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})

  export class ContactUsComponent implements OnInit {
    onSubmit(FormData: any) {
      console.log(FormData)
      this.contact.PostMessage(FormData)
      .subscribe(response => {
      location.href = 'https://mailthis.to/confirm'
      console.log(response)
      }, error => {
      console.warn(error.responseText)
      console.log({ error })
      })
      }
    FormData!: FormGroup ;
    loggedValue$!: Observable<boolean>;
    constructor(private builder: FormBuilder,
      private authService : AuthService,
      private contact: ContactService
      ) {}



  ngOnInit(): void {
    this.FormData = this.builder.group({
      reason: new FormControl('', [Validators.required]),
      Comment: new FormControl('', [Validators.required])
      })
      this.loggedValue$= this.authService.logged$;
  }
  }
