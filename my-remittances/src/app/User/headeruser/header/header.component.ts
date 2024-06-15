import { Component, OnInit } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterLink, Router, ActivatedRoute } from '@angular/router';
import { HomeComponent } from '../../../admin/homeAdmin/home.component';
import { LoginService } from '../../../login/login.service';
import { Ioffice, officeService } from '../../../admin/office-manager/servece.service';
import { CommonModule } from '@angular/common';
import { IUser, Root, UserserviceService } from '../../../admin/user-manger/userservice.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
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
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponentuser implements OnInit {
  notificationCount: number = 0;
  office: Ioffice; // تعريف متغير لتخزين تفاصيل المكتب
  user: Root; // تعريف المتغير لتخزين بيانات المستخدم

  constructor(
    private logoutService: LoginService,
    private router: Router,
    private officeService: officeService, // حقن خدمة المكتب
    private userService: UserserviceService
  ) { }

  ngOnInit(): void {
    const officeId = localStorage.getItem('officeId');
    if (officeId) {
      this.loadOfficeDetails(officeId); // تحميل تفاصيل المكتب عند تهيئة المكون
    }
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.loadUserData(userId); // تحميل بيانات المستخدم عند تهيئة المكون
    }
  }

  loadOfficeDetails(officeId: string) {
    this.officeService.getofficeById(officeId).subscribe({
      next: (office: Ioffice) => {
        this.office = office;
      },
      error: (error) => {
        console.error('Error fetching office details:', error);
      }
    });
  }

  loadUserData(userId: string) {
    this.userService.getUserByIdprofile(userId).subscribe({
      next: (response: Root) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  logout() {
    this.logoutService.logout();
    this.router.navigate(['/login']);
  }
}
