import { Component, ViewChild, ɵɵqueryRefresh } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { combineLatest, map, Observable } from 'rxjs';
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
  userEmail$!:Observable<string>;
  accessToken$!: Observable<string>;

  displayedColumnsCleaningHistory: string[] = ['beforePicture', 'afterPicture', 'score', 'date','email','updateScore', 'delete'];
  dataSourceCleaningHistory = new MatTableDataSource<HistoryCleaningAction>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>
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
      this.userEmail$= this.authService.userEmail$
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
        id: row.id,
        score: row.score
      };

      this.fileUploadService.updateScore(row,accessToken).subscribe(
        () => {
          console.log('Score updated successfully');

          this.cleaningHistory$ = this.cleaningHistory$.pipe(
            map(items => items.filter(it => it.id !== row.id))
          );
          this.table.renderRows()

        },
        (error) => {
          console.error('Error updating score:', error);
        }
      );

  });
}

deleteCleaningAction(row: any) {
  this.authService.accessToken$.subscribe(accessToken => {
  const id = row.id;

  this.cleaningHistory$ = this.cleaningHistory$.pipe(
    map(items => items.filter(item => item.id !== id))
  );
  this.table.removeRowDef(row)

  this.fileUploadService.deleteCleaningAction(id, accessToken).subscribe(
    () => {
      console.log("success")
    },
    (error) => {
      console.error('Error deleting row:', error);
    }
  );
  });
}

refresh() {

}

}
