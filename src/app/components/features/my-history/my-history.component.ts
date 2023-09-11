import { AfterViewInit,Component,ViewChild } from '@angular/core';
import { Observable, map, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {HistoryCleaningAction} from 'src/app/models/history-cleaningAction.model'
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { TakenCupon } from 'src/app/models/taken-cupon';
import { CuponService } from 'src/app/services/cupon.service';


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
  purchaseHistory$!: Observable<TakenCupon[]>;


  displayedColumnsCleaningHistory: string[] = ['beforePicture', 'afterPicture', 'score', 'date'];
  displayedColumnsPurchase: string[] = ['cuponImage', 'description', 'amount', 'status'];
  dataSourceCleaningHistory = new MatTableDataSource<HistoryCleaningAction>([]);
  dataSourcePurchase = new MatTableDataSource<TakenCupon>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(

    private authService : AuthService,
    private fileUploadService: FileUploadService,
    private cuponService: CuponService,
    ) {}
    ngAfterViewInit() {
      this.dataSourceCleaningHistory.paginator = this.paginator;
      this.dataSourceCleaningHistory.sort = this.sort;
      this.dataSourcePurchase.paginator = this.paginator;
      this.dataSourcePurchase.sort = this.sort;
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
            this.dataSourceCleaningHistory.data = cleaningActions; // Assign the data to the dataSource directly
          },
          (error) => {
            console.log('Error fetching cleaning history:', error);
          }
        );
      });

      this.loggedValue$.subscribe(loggedIn => {
        if (loggedIn) {
          this.authService.accessToken$.subscribe(accessToken => {
            this.authService.userId$.subscribe(userId => {
              if (accessToken && userId) {
                this.purchaseHistory$ = this.cuponService.getCupons(userId, accessToken);
                this.purchaseHistory$.subscribe(
                  (purchase: TakenCupon[]) => {
                    console.log('purchase:', purchase); // Check if data is coming from the server
                    this.dataSourcePurchase.data = purchase; // Assign the data to the dataSource directly
                  },
                  (error) => {
                    console.log('Error fetching cleaning history:', error);
                  }
                );
              }
            });
          });
        }
      });

    }
    applyFilterCleaningAction(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceCleaningHistory.filter = filterValue.trim().toLowerCase();

      if (this.dataSourceCleaningHistory.paginator) {
        this.dataSourceCleaningHistory.paginator.firstPage();
      }
    }

    applyFilterpurchase(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourcePurchase.filter = filterValue.trim().toLowerCase();

      if (this.dataSourcePurchase.paginator) {
        this.dataSourcePurchase.paginator.firstPage();
      }
    }

}
