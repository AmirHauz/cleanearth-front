import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import{MatToolbarModule} from '@angular/material/toolbar'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutComponent } from './components/features/about/about.component';
import { CheckoutComponent } from './components/features/checkout/checkout.component';
import { ContactUsComponent } from './components/features/contact-us/contact-us.component';
import { CounterComponent } from './components/features/counter/counter.component';
import { HelpComponent } from './components/features/help/help.component';
import { HomeComponent } from './components/features/home/home.component';
import { LoginComponent } from './components/features/login/login.component';
import { MyHistoryComponent } from './components/features/my-history/my-history.component';
import { PhotoComponent } from './components/features/photo/photo.component';
import { ProfileComponent } from './components/features/profile/profile.component';
import { RegisterComponent } from './components/features/register/register.component';
import { ShopComponent } from './components/features/shop/shop.component';
import { MyCategoriesComponent } from './components/my-categories/my-categories.component';
import { MyFooterComponent } from './components/my-footer/my-footer.component';
import { MyNavBarComponent } from './components/my-nav-bar/my-nav-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import {MatBadgeModule} from '@angular/material/badge';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import { BalanceComponent } from './components/balance/balance.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../enviroments/environment';
import { ToastrModule, } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from'@angular/material/select';
import { BalanceService } from './services/balance.service';
import { BalanceSharedService } from './services/balance-shared.service';
import { TransactionComponent } from './components/features/transaction/transaction.component';
import { UpdateScoresComponent } from './components/features/update-scores/update-scores.component';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { TransactionDialogComponent } from './components/features/transaction/transaction-dialog';
import { FilterByStatusPipe } from './shared/filter-by-status.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CheckoutComponent,
    ContactUsComponent,
    CounterComponent,
    HelpComponent,
    HomeComponent,
    LoginComponent,
    MyHistoryComponent,
    PhotoComponent,
    ProfileComponent,
    RegisterComponent,
    ShopComponent,
    MyCategoriesComponent,
    MyFooterComponent,
    MyNavBarComponent,
    BalanceComponent,
    UpdateScoresComponent,
    TransactionComponent,
    TransactionDialogComponent,
    FilterByStatusPipe,



  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatBadgeModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    ToastrModule.forRoot(),
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,

  ],
  providers: [HttpClient,BalanceService,BalanceSharedService],
  bootstrap: [AppComponent,MyCategoriesComponent]
})
export class AppModule { }
