import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Root, UserserviceService } from '../../../admin/user-manger/userservice.service';
import { Ioffice, officeService } from '../../../admin/office-manager/servece.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header', 
  standalone: true, 
  imports: [
    MatIconModule, 
    RouterLink,
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
  ],
  templateUrl: './Home.component.html', // رابط إلى ملف HTML للقالب
  styleUrls: ['./Home.component.css'] // رابط إلى ملف CSS للتنسيق
})
export class HomeComponentUser implements OnInit {
  root: Root; // تعريف المتغير لتخزين بيانات المستخدم
  office: Ioffice; // تعريف المتغير لتخزين بيانات المكتب

  constructor(
    private userService: UserserviceService, // حقن خدمة المستخدم
    private officeService: officeService // حقن خدمة المكتب
  ) {}

  ngOnInit(): void {
    const officeId = localStorage.getItem('officeId'); // الحصول على معرّف المكتب 
    if (officeId) {
      this.loadOfficeDetails(officeId); 
    }
    const userId = localStorage.getItem('userId'); // الحصول على معرّف المستخدم   
    if (userId) {
      this.loadUserData(userId);
    }
  }

  loadOfficeDetails(officeId: string): void {
    this.officeService.getofficeById(officeId).subscribe({
      next: (office: Ioffice) => {
        this.office = office; // تعيين بيانات المكتب إلى المتغير
      },
      error: (error) => {
        console.error('Error fetching office details:', error); // طباعة خطأ في حال فشل الحصول على البيانات
      }
    });
  }

  loadUserData(userId: string): void {
    this.userService.getUserByIdprofile(userId).subscribe({
      next: (response: Root) => {
        this.root = response; // تعيين بيانات المستخدم إلى المتغير
      },
      error: (error) => {
        console.error('Error fetching user data:', error); // طباعة خطأ في حال فشل الحصول على البيانات
      }
    });
  }
}
