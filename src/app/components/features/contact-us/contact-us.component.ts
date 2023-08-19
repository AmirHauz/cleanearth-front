import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ContactService } from 'src/app/services/contact.service';
import { Reason } from 'src/app/models/reason.model';
import emailjs from '@emailjs/browser';
import { async } from '@firebase/util';



@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})

export class ContactUsComponent {
  FormData!: FormGroup;
  loggedValue$!: Observable<boolean>;
  accessToken$!: Observable<string>;
  selectedValue!: string;
  userEmailValue$!: Observable<string>;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private contact: ContactService
  ) { }

  ressons:Reason[] =[
    {value:'technical support on upload pictures-0', viewValue:'Technical support on upload picture'},
    {value:'technical support on buying cupon-1', viewValue:'Technical support on buying cupon'},
    {value:"didn't get a cleanearth points on a clean -2", viewValue:"Didn't get a cleanearth points on a clean"},
    {value:'Other reason-3', viewValue:'Other reason'}
  ]


  ngOnInit(): void {
    this.userEmailValue$= this.authService.userEmail$

    this.FormData = this.builder.group({
      reason: new FormControl('', ),
      comment: new FormControl('', [Validators.required])
    });

    this.loggedValue$ = this.authService.logged$;
    this.accessToken$ = this.authService.accessToken$;
  }
  async send() {
    this.userEmailValue$.pipe(take(1)).subscribe(email => {
      emailjs.send("service_ate8zbo", "template_p2qnvsj", {
        email: email,
        reason: this.FormData.value.reason,
        comment: this.FormData.value.comment,
      }, "CIEQcMok4YL2ZNHvO")
      .then((response) => {
        alert('message has been sent.');
        this.FormData.reset();
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
    });
  }

  onSubmit(FormData: any) {
    if (this.FormData.valid) {
      this.accessToken$.subscribe(token => {
        const formData = this.FormData.value;
        this.contact.PostMessage(formData, token)
          .subscribe((response) => {
            console.log(response);
          }, (error) => {
            console.warn(error);
          });
      });
    }
  }
}

