import { Injectable,Component } from '@angular/core';
import { FileUpload } from '../models/file-upload.model';
import { Observable, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { finalize } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  images : string[] = [];
   myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  private basePath = '/uploads';
  private readonly MYSERVER = 'http://127.0.0.1:8000/cleaningAction/';
  constructor(
    private storage: AngularFireStorage,
    private http: HttpClient
  ){ }


  pushFileToStorage(fileUploadBefore: FileUpload, fileUploadAfter: FileUpload, token: string): Observable<number | undefined> {
    // implement calling
    const fileBeforePath = `${this.basePath}/${fileUploadBefore.file.name}`;
    const storageRef = this.storage.ref(fileBeforePath);
    const uploadTaskBefore = this.storage.upload(fileBeforePath, fileUploadBefore.file);

    const fileAfterPath = `${this.basePath}/${fileUploadAfter.file.name}`;
    const storageRefAfter = this.storage.ref(fileAfterPath);
    const uploadTaskAfter = this.storage.upload(fileAfterPath, fileUploadAfter.file);

    uploadTaskBefore.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          console.log(downloadURL)
          fileUploadBefore.name = fileUploadBefore.file.name;
          fileUploadBefore.url = downloadURL;

          uploadTaskAfter.snapshotChanges().pipe(
            finalize(() => {
              storageRefAfter.getDownloadURL().subscribe(downloadURL => {
                console.log(downloadURL)
                fileUploadAfter.name = fileUploadAfter.file.name;
                fileUploadAfter.url = downloadURL;

                this.saveFileData(fileUploadBefore, fileUploadAfter, token).subscribe(response => {
                  console.log('File uploaded successfully');
                }, error => {
                  console.log('Error uploading file:', error);
                });

              });
            })
          ).subscribe();

        });
      })
    ).subscribe();

    return uploadTaskAfter.percentageChanges();
  }

  private saveFileData(fileUploadBefore: FileUpload, fileUploadAfter: FileUpload, token: string): Observable<any> {
    console.log("the token in the service is: ", token);
    const url = `${this.MYSERVER}`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    console.log("name", fileUploadBefore.name)
    console.log("url", fileUploadBefore.url)
    console.log("userID", fileUploadBefore.userID)
    const body = {
      user: fileUploadBefore.userID,
      beforePicture: fileUploadBefore.url,
      afterPicture: fileUploadAfter.url,
    }
    return this.http.post(url, body, { headers: headers });
    
  }


  getFilesByUserId(userId: number, token: string): any {
    // return this.db.list(this.basePath, ref =>
    //   ref.orderByChild('userID').equalTo(userId).limitToLast(numberItems));
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get(`${this.MYSERVER}`, { headers: headers }).pipe(
      catchError(error => throwError(error))
    );
  }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch((error: any) => console.log(error));
  }

  private deleteFileDatabase(key: string): any {
    // return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}
