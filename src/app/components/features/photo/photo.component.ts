import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { map, Observable, switchMap, take } from 'rxjs';
import{ AuthService } from 'src/app/services/auth.service';
import { FileUpload } from 'src/app/models/file-upload.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import * as $ from "jquery";
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @ViewChild('imageUploadWrapBefore') imageUploadWrapBefore!: ElementRef;
  @ViewChild('imageUploadWrapAfter') imageUploadWrapAfter!: ElementRef;
  @ViewChild('fileUploadImageBefore') fileUploadImageBefore!: ElementRef;
  @ViewChild('fileUploadImageAfter') fileUploadImageAfter!: ElementRef;
  @ViewChild('fileUploadContentBefore') fileUploadContentBefore!: ElementRef;
  @ViewChild('fileUploadContentAfter') fileUploadContentAfter!: ElementRef;
  @ViewChild('imageTitleBefore') imageTitleBefore!: ElementRef;
  @ViewChild('imageTitleAfter') imageTitleAfter!: ElementRef;
  loggedValue$!: Observable<boolean>;
  userValue$!: Observable<string>;
  userId$!: Observable<number>;
  selectedFilesBefore?: FileList;
  selectedFilesAfter?: FileList;
  currentFileUpload?: FileUpload;
  percentage: number = 0;
  imageUrlBefore: any;
  imageUrlAfter:any;
  accessToken$!: Observable<string>;
  imageUploadedBefore = false;
  imageUploadedAfter = false;


  constructor(
    private uploadService: FileUploadService,
    private authService: AuthService,
    private toastr: ToastrService) {
  }
  ngOnInit(): void {
    this.loggedValue$ = this.authService.logged$;
    this.userValue$ = this.authService.userName$;
    this.userId$ = this.authService.userId$


    this.authService.accessToken$.subscribe((token: string) => {
      console.log("Access token value photo:", token);
    });
  }

  readURL(input: any, imageType: string) {
    console.log("readURL function called");
    if (input.files && input.files[0]) {
      console.log("input.files work");
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (imageType === 'before') {
          this.imageUploadWrapBefore.nativeElement.classList.add('image-dropping');
          this.fileUploadImageBefore.nativeElement.src = e.target.result;
          this.fileUploadContentBefore.nativeElement.style.display = 'block';
          this.imageTitleBefore.nativeElement.innerHTML = input.files[0].name;
          this.imageUrlBefore = e.target.result;
          this.selectedFilesBefore = input.files;
        } else if (imageType === 'after') {
          this.imageUploadWrapAfter.nativeElement.classList.add('image-dropping');
          this.fileUploadImageAfter.nativeElement.src = e.target.result;
          this.fileUploadContentAfter.nativeElement.style.display = 'block';
          this.imageTitleAfter.nativeElement.innerHTML = input.files[0].name;
          this.imageUrlAfter = e.target.result;
          this.selectedFilesAfter = input.files;
        }
        if (this.fileUploadContentBefore.nativeElement.style.display != ''){
          this.imageUploadedBefore = true;
        }
        console.log("sanja")
        console.log(this.fileUploadContentBefore.nativeElement.style.display)
        console.log(this.fileUploadContentAfter.nativeElement.style.display)
        if (this.fileUploadContentAfter.nativeElement.style.display != ''){
          this.imageUploadedAfter = true;
        }
      };
      reader.readAsDataURL(input.files[0]); // Invoke the reader to read the file data
    }
  }


  upload(): void {
    console.log("upload called");
    if (this.selectedFilesBefore && this.selectedFilesBefore.length > 0 &&
      this.selectedFilesAfter && this.selectedFilesAfter.length > 0) {
      const fileBefore: File | null = this.selectedFilesBefore.item(0);
      const fileAfter: File | null = this.selectedFilesAfter.item(0);
      console.log("fileBefore in component!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:", fileBefore)
      console.log("fileAfter in component!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!:", fileAfter)

      this.selectedFilesBefore = undefined;

      if (fileBefore && fileAfter) {
        let userId: number;
            this.userId$.pipe(
              take(1)
            ).subscribe(id => {
              userId = id;
            });
        this.authService.accessToken$.pipe(
          take(1),
          switchMap((token: any) => {

            const fileUploadBefore = new FileUpload(fileBefore, userId);
            const fileUploadAfter = new FileUpload(fileAfter, userId);


            return this.uploadService.pushFileToStorage(fileUploadBefore, fileUploadAfter, token);
          })
        ).subscribe(
          (percentage: number | undefined) => {
            if (percentage) {
              this.percentage = Math.round(percentage);
              if (this.percentage === 100) {
                this.toastr.success('Upload successful', 'Success', { timeOut: 3000 });

                // Refresh the app after successful upload
                window.location.reload();

              }
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
    }
  }

  //////////////for the green add photo boxes:


  removeUpload(imageType: string) {
    if (imageType === 'before') {
      this.fileUploadImageBefore.nativeElement.src = '';
      this.fileUploadContentBefore.nativeElement.style.display = 'none';
      this.selectedFilesBefore = undefined;
    } else if (imageType === 'after') {
      this.fileUploadImageAfter.nativeElement.src = '';
      this.fileUploadContentAfter.nativeElement.style.display = 'none';
      this.selectedFilesAfter = undefined;
    }
    if (this.fileUploadContentBefore.nativeElement.style.display = 'none'){
      this.imageUploadedBefore = false
    }
    if (this.fileUploadContentAfter.nativeElement.style.display = 'none'){
      this.imageUploadedAfter = false
    }

  }
  /////////////////////////////////////////

}
