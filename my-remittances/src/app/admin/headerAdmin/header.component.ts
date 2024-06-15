import { Component, OnInit } from '@angular/core';
import {  Router, RouterLink, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatAutocompleteModule } from "@angular/material/autocomplete"
import { MatMenuModule } from "@angular/material/menu"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatBadgeModule } from "@angular/material/badge"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatListModule } from "@angular/material/list"
import { MatCardModule } from "@angular/material/card"
import { MatSliderModule } from "@angular/material/slider"
import { MatTableModule } from "@angular/material/table"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSortModule } from "@angular/material/sort"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatRadioModule } from "@angular/material/radio"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatDialogModule } from "@angular/material/dialog"
import { HomeComponent } from '../homeAdmin/home.component';
import { LoginService } from '../../login/login.service';
import { IUser, Root, UserserviceService } from '../user-manger/userservice.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HomeComponent,
    RouterModule,
    RouterLink,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatSliderModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDialogModule,
    CommonModule 
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  notificationCount: number = 0;
  user: Root;
  selectedLanguage: string;
  translations: { [key: string]: string }; // تعريف الخاصية هنا

  constructor(
    private logoutService: LoginService,
    private router: Router,
    private userService: UserserviceService,
    private translate: TranslateService,
  ) {
    this.selectedLanguage = 'ar';
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId'); // جلب userId من التخزين المحلي
    if (userId) {
      this.loadUserData(userId); // تحميل بيانات المستخدم لما يتفعل الكومبوننت
    }

     // تحميل اللغة الافتراضية
     this.translate.use(this.selectedLanguage).subscribe(translations => {
      this.translations = translations;
    });
  }

  loadUserData(userId: string) {
    this.userService.getUserByIdprofile(userId).subscribe({
      next: (response: Root) => {
        this.user = response; // تخزين بيانات المستخدم
      },
      error: (error) => {
        console.error('Error fetching user data:', error); // طباعة الخطأ في حال وجود مشكلة
      }
    });
  }

  logout() {
    this.logoutService.logout(); // تسجيل الخروج
    this.router.navigate(['/login']); // إعادة التوجيه إلى صفحة تسجيل الدخول
  }

  // الدالة المستدعاة عند تغيير اللغة
  onLanguageChange(language: string) {
    this.selectedLanguage = language;
    this.translate.use(language).subscribe(translations => {
      this.translations = translations;
    });
  }
}
