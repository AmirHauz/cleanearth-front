# CleanEarth

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

```
<div *ngIf="loggedValue$ | async; else elseBlock">
  <script
    class="jsbin"
    src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"
  ></script>
  <div class="file-upload">
    <div *ngIf="!imageUploaded">
      <div class="image-upload-wrap" #imageUploadWrapBefore>
        <input
          class="file-upload-input"
          type="file"
          (change)="readURL($event.target)"
          accept="image/*"
        />
        <div class="drag-text">
          <h3>Drag and drop a file or select add Image</h3>
        </div>
      </div>
      <div class="file-upload-content" #fileUploadContentBefore>
        <img
          class="file-upload-image"
          #fileUploadImageBefore
          src="#"
          alt="your image"
        />
        <div class="image-title-wrap">
          <button type="button" (click)="removeUpload()" class="remove-image">
            Remove
            <span #imageTitleBefore class="image-title">Uploaded Image</span>
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="imageUploaded">
      <img [src]="imageUrlBefore" alt="your image" />
      <button type="button" (click)="removeUpload()" class="remove-image">
        Remove <span #imageTitleBefore class="image-title">Uploaded Image</span>
      </button>
    </div>

    <div class="file-upload">
      <div *ngIf="!imageUploaded">
        <div class="image-upload-wrap" #imageUploadWrapAfter>
          <input
            class="file-upload-input"
            type="file"
            (change)="readURL($event.target)"
            accept="image/*"
          />
          <div class="drag-text">
            <h3>Drag and drop a file or select add Image</h3>
          </div>
        </div>
        <div class="file-upload-content" #fileUploadContentAfter>
          <img
            class="file-upload-image"
            #fileUploadImageAfter
            src="#"
            alt="your image"
          />
          <div class="image-title-wrap">
            <button type="button" (click)="removeUpload()" class="remove-image">
              Remove
              <span #imageTitleAfter class="image-title">Uploaded Image</span>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="imageUploaded">
        <img [src]="imageUrlAfter" alt="your image" />
        <button type="button" (click)="removeUpload()" class="remove-image">
          Remove
          <span #imageTitleAfter class="image-title">Uploaded Image</span>
        </button>
      </div>
    </div>
    <button
      class="btn btn-success btn-sm"
      [disabled]="!imageUploaded"
      (click)="upload()"
    >
      Upload
    </button>
    <p>Upload progress: {{ percentage }}%</p>
  </div>

  <ng-template #elseBlock>photo not logged</ng-template>
</div>

  <!-- <div *ngIf="loggedValue$ | async;else elseBlock">
  <script class="jsbin" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<div class="file-upload">
<div *ngIf="!imageUploaded">
  <div class="image-upload-wrap" #imageUploadWrap>
    <input class="file-upload-input" type='file' (change)="readURL($event.target)" accept="image/*" />
    <div class="drag-text">
      <h3>Drag and drop a file or select add Image</h3>
    </div>
  </div>
  <div class="file-upload-content" #fileUploadContent>
    <img class="file-upload-image" #fileUploadImage src="#" alt="your image" />
    <div class="image-title-wrap">
      <button type="button" (click)="removeUpload()" class="remove-image">Remove <span #imageTitle class="image-title">Uploaded Image</span></button>
    </div>
  </div>
</div>

<div *ngIf="imageUploaded">
  <img [src]="imageUrl" alt="your image" />
      <button type="button" (click)="removeUpload()" class="remove-image">Remove <span #imageTitle class="image-title">Uploaded Image</span></button>
    </div>

    <button class="btn btn-success btn-sm" [disabled]="!isFileSelected" (click)="upload()">Upload</button>
  </div> -->

  <!-- <div class="float-container">
    <div class="float-child">
  <script class="jsbin" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<div class="file-upload">
  <button class="file-upload-btn" type="button" onclick="$('.file-upload-input').trigger( 'click' )">Add before cleaning Image</button>

  <div class="image-upload-wrap">
    <input class="file-upload-input" type='file' onchange="readURL(this);" accept="image/*" />
    <div class="drag-text">
      <h3>Drag and drop before cleaning file or select add Image</h3>
    </div>
  </div>
  <div class="file-upload-content">
    <img class="file-upload-image" src="#" alt="your image" />
    <div class="image-title-wrap">
      <button type="button" onclick="removeUpload()" class="remove-image">Remove <span class="image-title">Uploaded Image</span></button>
    </div>
  </div>
</div>
</div>
<div class="float-child">
<script class="jsbin" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<div class="file-upload">
  <button class="file-upload-btn" type="button" onclick="$('.file-upload-input').trigger( 'click' )">Add after cleaning Image</button>

  <div class="image-upload-wrap">
    <input class="file-upload-input" type='file' onchange="readURL(this);" accept="image/*" />
    <div class="drag-text">
      <h3>Drag and drop after cleaning file or select add Image</h3>
    </div>
  </div>
  <div class="file-upload-content">
    <img class="file-upload-image" src="#" alt="your image" />
    <div class="image-title-wrap">
      <button type="button" onclick="removeUpload()" class="remove-image">Remove <span class="image-title">Uploaded Image</span></button>
    </div>
  </div>
</div>
</div>
</div>
<div class="col-4">
  <button
    class="btn btn-success btn-sm"
    [disabled]="!selectedFiles"
    (click)="upload()"
  >
    Upload
  </button>
</div> -->

  <!-- </div>

<ng-template #elseBlock>photo not loged</ng-template> -->


```
