import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/features/about/about.component';
import { CheckoutComponent } from './components/features/checkout/checkout.component';
import { ContactUsComponent } from './components/features/contact-us/contact-us.component';
import { HelpComponent } from './components/features/help/help.component';
import { HomeComponent } from './components/features/home/home.component';
import { LoginComponent } from './components/features/login/login.component';
import { MyHistoryComponent } from './components/features/my-history/my-history.component';
import { PhotoComponent } from './components/features/photo/photo.component';
import { ProfileComponent } from './components/features/profile/profile.component';
import { RegisterComponent } from './components/features/register/register.component';
import { ShopComponent } from './components/features/shop/shop.component';
import { TransactionComponent } from './components/features/transaction/transaction.component';

const routes: Routes = [
  {path:"home",component:HomeComponent},
  {path:"profile",component:ProfileComponent},
  {path:"shop", component:ShopComponent},
  {path:"photo", component:PhotoComponent},
  {path:"myHistory",component:MyHistoryComponent},
  {path:"checkout",component:CheckoutComponent},
  {path:"login",component:LoginComponent},
  {path:"signup",component:RegisterComponent},
  {path:"help", component:HelpComponent},
  {path:"about", component:AboutComponent},
  {path:"contactUs", component:ContactUsComponent},
  {path:"transaction", component:TransactionComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
