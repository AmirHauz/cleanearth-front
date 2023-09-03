import { AfterViewInit,Component,ViewChild } from '@angular/core';
import { Observable, map, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {HistoryCleaningAction} from 'src/app/models/history-cleaningAction.model'
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { FileUploadService } from 'src/app/services/file-upload.service';


@Component({
  selector: 'app-my-history',
  templateUrl: './my-history.component.html',
  styleUrls: ['./my-history.component.scss']
})
export class MyHistoryComponent implements AfterViewInit{
  loggedValue$!: Observable<boolean>;
  userId$!: Observable<number>;
  accessToken$!: Observable<string>;
  cleaningHistory$!: Observable<HistoryCleaningAction[]>;


  displayedColumns: string[] = ['beforePicture', 'afterPicture', 'score', 'date'];
  dataSource = new MatTableDataSource<HistoryCleaningAction>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(

    private authService : AuthService,
    private fileUploadService: FileUploadService
    ) {}
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    ngOnInit(): void {
      this.loggedValue$= this.authService.logged$;
      this.accessToken$ = this.authService.accessToken$;
      this.userId$ = this.authService.userId$
      this.authService.getAllDetails();

      // this.accessToken$.pipe(
      //   map((tokenObj: any) => tokenObj.token)
      // ).subscribe((token: string) => {
      //   console.log("Access token value cleaning history!!!!!!!!!!!!!!!!!!!: ", token);
      // });

       // Combine the userId$ and accessToken$ observables into a new observable
      const cleaningActionParams$ = combineLatest([this.userId$, this.accessToken$]);

      // Subscribe to the profileParams$ observable and retrieve the values
      cleaningActionParams$.subscribe(([userId, accessToken]) => {
        this.cleaningHistory$ = this.fileUploadService.getFilesByUserId(
          userId,
          accessToken
        );

        this.cleaningHistory$.subscribe(
          (cleaningActions: HistoryCleaningAction[]) => {
            console.log('Cleaning Actions:', cleaningActions); // Check if data is coming from the server
            this.dataSource.data = cleaningActions; // Assign the data to the dataSource directly
          },
          (error) => {
            console.log('Error fetching cleaning history:', error);
          }
        );
      });
    }
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

}
