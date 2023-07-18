export class FileUpload {
  key!: string;
  name!: string;
  url!: string;
  file: File;
  userID! :number

  constructor(file: File, userId:number) {
    this.file = file;
    this.userID = userId
  }
}
