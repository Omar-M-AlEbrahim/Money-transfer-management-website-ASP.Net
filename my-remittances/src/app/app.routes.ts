import { Routes } from '@angular/router';
import { HomeComponent } from './admin/homeAdmin/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './admin/headerAdmin/header.component';
import { UserAddComponent } from './admin/user-manger/user-add.component';
import { OfficesComponent } from './admin/office-manager/offices.component';
import { ExchangePricesComponent } from './exchange-prices/exchange-prices.component';
import { TransferComponent } from './admin/transfer/transfer.component';
import { AuthGuardService } from './login/auth-guard.service';
import { HomeComponentUser } from './User/homeuser/header/Home.component';
import { HeaderComponentuser } from './User/headeruser/header/header.component';
import { SendTrasfireComponent } from './User/Remittance-operations/create-trasfire/send-trasfire/send-trasfire.component';
import { ReceivingcomponentComponent } from './User/Remittance-operations/Receiving-the-transfer/receivingcomponent/receivingcomponent.component';
import { ViewTrasfireiseqlaetruecomponantComponent } from './User/Remittance-operations/view-trasfire/view-trasfireiseqlaetruecomponant/view-trasfireiseqlaetruecomponant.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin-dashboard',
    component: HeaderComponent, // المكون الذي يحتوي على الـ headers والـ sidebar للمسؤولين
    canActivate: [AuthGuardService], // تطبيق AuthGuard على الوصول إلى الـ admin-dashboard
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] }, // تطبيق AuthGuard على الوصول إلى الصفحة الرئيسية
      { path: 'trasfir', component: TransferComponent ,canActivate: [AuthGuardService]}, 
      { path: 'userdata', component: UserAddComponent,canActivate: [AuthGuardService] }, 
      { path: 'officedata', component: OfficesComponent,canActivate: [AuthGuardService] }, 
      { path: 'exchangePrices', component: ExchangePricesComponent,canActivate: [AuthGuardService] }, 
      { path: '**', component: HomeComponent }, // تطبيق AuthGuard على الوصول إلى الصفحة الرئيسية
    ],
  },

  {
    path: 'user-dashboard',
    component: HeaderComponentuser, // المكون الذي يحتوي على الـ headers والـ sidebar للمستخدمين
    canActivate: [AuthGuardService], // تطبيق AuthGuard على الوصول إلى الـ user-dashboard
    children: [
      { path: '', redirectTo: 'Home', pathMatch: 'full' },
      { path: 'Home', component: HomeComponentUser, canActivate: [AuthGuardService] }, // تطبيق AuthGuard على الوصول إلى الصفحة الرئيسية للمستخدمين
     { path: 'viewreTrasfirtrue', component: ViewTrasfireiseqlaetruecomponantComponent,canActivate: [AuthGuardService] }, 
      { path: 'viewreTrasfirnottrue', component: ReceivingcomponentComponent,canActivate: [AuthGuardService] }, 
      { path: 'creatTransfir', component: SendTrasfireComponent,canActivate: [AuthGuardService] }, 
      { path: 'exchangePrices', component: ExchangePricesComponent,canActivate: [AuthGuardService] }, 
      { path: '**', component: HomeComponentUser}, // تطبيق AuthGuard على الوصول إلى الصفحة الرئيسية للمستخدمين
    ],
  },


  { path: '**', redirectTo: 'login' }, // تحويل إلى صفحة تسجيل الدخول في حال عدم وجود مسار مطابق
];