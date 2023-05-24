import { Injectable,Component } from '@angular/core';
import { FileUpload } from '../models/file-upload.model';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';

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


  pushFileToStorage(fileUpload: FileUpload,token: string): Observable<number | undefined> {
    // implement calling
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
    const userId: string = localStorage.getItem('userId') || '';


    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          fileUpload.userID = fileUpload.userID

          this.saveFileData(fileUpload, token).subscribe(response => {
            console.log('File uploaded successfully');
          }, error => {
            console.log('Error uploading file:', error);
          });
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  private saveFileData(fileUpload: FileUpload, token: string): Observable<any> {
    console.log("the token in the service is: ", token);
    const url = `${this.MYSERVER}`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    console.log("file", fileUpload.file)
    console.log("key", fileUpload.key)
    console.log("name", fileUpload.name)
    console.log("url", fileUpload.url)
    console.log("userID", fileUpload.userID)
    return this.http.post(url, fileUpload, { headers: headers });
  }



  getFilesByUserId(userId: string,numberItems: number): any {
    // return this.db.list(this.basePath, ref =>
    //   ref.orderByChild('userID').equalTo(userId).limitToLast(numberItems));
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
