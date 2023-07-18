import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, map, Observable, switchMap, take } from 'rxjs';
import { Profile } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  profileToEdit: Profile = { fullName: '', aboutMe: '', dateOfBirth: '' };
  profileForm!: FormGroup
  error!: string;
  success!: string;
  userId$!: Observable<number>;
  profile$!: Observable<Profile>;
  loggedValue$!: Observable<boolean>;
  accessToken$!: Observable<string>;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
  ) { }

  ngOnInit(): void {
    this.loggedValue$ = this.authService.logged$;
    this.accessToken$ = this.authService.accessToken$;
    this.userId$ = this.authService.userId$

    console.log("accessToken in profile.component.ts", this.accessToken$);

    // this.accessToken$.pipe(
    //   map((tokenObj: any) => tokenObj.token)
    // ).subscribe((token: string) => {
    //   console.log("Access token value profile: ", token);
    // });

    this.profileForm = this.formBuilder.group({
      fullName: [this.profileToEdit.fullName, Validators.maxLength(50)],
      aboutMe: [this.profileToEdit.aboutMe, Validators.maxLength(200)],
      dateOfBirth: [this.profileToEdit.dateOfBirth],
    })

    // Combine the userId$ and accessToken$ observables into a new observable
    const profileParams$ = combineLatest([this.userId$, this.accessToken$]);

    // Subscribe to the profileParams$ observable and retrieve the values
    profileParams$.subscribe(([userId, accessToken]) => {
      this.profile$ = this.profileService.getProfile(userId, accessToken);

      this.profile$.subscribe((profile: any) => {
        console.log('Full Name:', profile.fullName);
        console.log('About Me:', profile.aboutMe);
        console.log('Date of Birth:', profile.dateOfBirth);
      })
      console.log("this is what we get hereeeeeeee:", this.profile$)
    });
  }

  save() {
    if (this.profileForm.invalid) {
      return;
    }
    let fullName1: string = '';
    let aboutMe1:string = '';
    let dateOfBirth1:string ='';
    let userId: number;
    this.userId$.pipe(
      take(1)
    ).subscribe(id => {
      userId = id;
    });
    this.profile$.pipe(
      take(1)
    ).subscribe(profile => {
      fullName1 = this.profileForm.get('fullName')?.value;
      if (fullName1 === ''){
        fullName1 = profile.fullName
      }
      aboutMe1 = this.profileForm.get('aboutMe')?.value;
      if (aboutMe1 === ''){
        aboutMe1 = profile.aboutMe
      }
      dateOfBirth1 = this.profileForm.get('dateOfBirth')?.value;
      if (dateOfBirth1 === ''){
        dateOfBirth1 = profile.dateOfBirth
      }


      this.accessToken$.pipe(
        take(1),
        switchMap(token => {
          return this.profileService.profile(
            userId,
            fullName1,
            aboutMe1,
            dateOfBirth1,
            token

          );
        })
      ).subscribe(
        data => {
          this.success = 'Profile updated successfully';
          this.profileToEdit = this.profileForm.value;
        },
        error => {
          this.error = error?.error?.message;
        }
      );

    })


  }

}
