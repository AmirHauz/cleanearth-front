import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable } from 'rxjs';
import { HistoryCleaningAction } from 'src/app/models/history-cleaningAction.model';
import { AuthService } from 'src/app/services/auth.service';
import { CuponService } from 'src/app/services/cupon.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-update-scores',
  templateUrl: './update-scores.component.html',
  styleUrls: ['./update-scores.component.scss']
})
export class UpdateScoresComponent {

  cleaningHistory$!: Observable<HistoryCleaningAction[]>;
  loggedValue$!: Observable<boolean>;
  userId$!: Observable<number>;
  accessToken$!: Observable<string>;

  displayedColumnsCleaningHistory: string[] = ['beforePicture', 'afterPicture', 'score', 'date','updateScore', 'delete'];
  dataSourceCleaningHistory = new MatTableDataSource<HistoryCleaningAction>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(

    private authService : AuthService,
    private fileUploadService: FileUploadService,
    ) {}

    ngAfterViewInit() {
      this.dataSourceCleaningHistory.paginator = this.paginator;
      this.dataSourceCleaningHistory.sort = this.sort;
    }

    ngOnInit(): void {
      this.loggedValue$= this.authService.logged$;
      this.accessToken$ = this.authService.accessToken$;
      this.userId$ = this.authService.userId$
      this.authService.getAllDetails();

       // Combine the userId$ and accessToken$ observables into a new observable
      const cleaningActionParams$ = combineLatest([ this.accessToken$]);

      // Subscribe to the profileParams$ observable and retrieve the values
      cleaningActionParams$.subscribe(([accessToken]) => {
        this.cleaningHistory$ = this.fileUploadService.getFilesAdmin(
          accessToken
        );

        this.cleaningHistory$.subscribe(
          (cleaningActions: HistoryCleaningAction[]) => {
            console.log('Cleaning Actions:', cleaningActions); // Check if data is coming from the server
            this.dataSourceCleaningHistory.data = cleaningActions; // Assign the data to the dataSource directly
          },
          (error) => {
            console.log('Error fetching cleaning history:', error);
          }
        );
      });
    }

    applyFilterCleaningAction(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceCleaningHistory.filter = filterValue.trim().toLowerCase();

      if (this.dataSourceCleaningHistory.paginator) {
        this.dataSourceCleaningHistory.paginator.firstPage();
      }
    }

    updateScore(row:any) {
      this.authService.accessToken$.subscribe(accessToken => {
      const data = {
        id: row.id, // Assuming you have an 'id' property in your row object
        score: row.score
      };

      this.fileUploadService.updateScore(row,accessToken).subscribe(
        () => {
          // Handle success, e.g., show a success message
          console.log('Score updated successfully');
        },
        (error) => {
          // Handle error, e.g., show an error message
          console.error('Error updating score:', error);
        }
      );

  });
}

deleteCleaningAction(row:any) {
  this.authService.accessToken$.subscribe(accessToken => {
  const id = row.id; // Assuming you have an 'id' property in your row object

  this.fileUploadService.deleteCleaningAction(id,accessToken).subscribe(
    () => {
      // Handle success, e.g., show a success message or remove the row from the table
      console.log('Row deleted successfully');
    },
    (error) => {
      // Handle error, e.g., show an error message
      console.error('Error deleting row:', error);
    }
  );
  });
}

}
