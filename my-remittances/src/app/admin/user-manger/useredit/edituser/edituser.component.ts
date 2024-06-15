import { routes } from './../../../../app.routes';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUser, UserserviceService } from '../../userservice.service';
import { map, take } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edituser',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatIconModule ,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,

  ],
  templateUrl: './edituser.component.html',
  styleUrl: './edituser.component.css'
})
export class EdituserComponent  {
  userToEdit: IUser; // تعريف الخاصية userToEdit

  constructor(private userService: UserserviceService , 
              @Inject(MAT_DIALOG_DATA) public data: IUser ,
  )
  { 
    this.userToEdit = this.data as IUser;
    //console.log(this.userToEdit.userName);
  }
  
  
  submitForm(editForm: NgForm) {
    if (editForm.valid) {
      // إرسال البيانات إلى الخادم عن طريق خدمة الويب
      this.userService.editeUser(this.userToEdit.id, this.userToEdit).subscribe({
        next: () => {
          console.log('تم تحديث بيانات المستخدم بنجاح!');
       },
        error: (error) => {
          console.error('حدث خطأ أثناء تحديث بيانات المستخدم:', error);
        }
      });      
    } else {
      console.log('الرجاء ملء الحقول المطلوبة بشكل صحيح');
    }
  }
}  

