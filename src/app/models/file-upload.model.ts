export class FileUpload {
  key!: string;
  name!: string;
  url!: string;
  file: File;
  userID! :string

  constructor(file: File,userId:string) {
    this.file = file;
    this.userID = userId
  }
}
