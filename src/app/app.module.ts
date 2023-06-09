import { NgModule } from '@angular/core';
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








  ],
  providers: [HttpClient,],
  bootstrap: [AppComponent,MyCategoriesComponent]
})
export class AppModule { }
