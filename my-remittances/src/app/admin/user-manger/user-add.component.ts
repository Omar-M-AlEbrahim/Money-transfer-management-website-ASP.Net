import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { IRole, IUser, UserserviceService } from './userservice.service';
import { Observable, map, switchMap, take } from 'rxjs';
import { MatSnackBar,  } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EdituserComponent } from './useredit/edituser/edituser.component';



@Component({
  selector: 'app-user-add',
  standalone: true,
  imports:  [
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
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent implements OnInit {
  role$: Observable<IRole>;
  users$: Observable<IUser[]>; // متغير لتخزين جميع المستخدمين
  userToEdit: IUser;
 displayedColumns: string[] = ['userName', 'email', 'userIsStatus', 'actions'];
  constructor(private userService: UserserviceService , 
              private _snackBar: MatSnackBar,
              private dialog: MatDialog) { }
            
  ngOnInit(): void {
    this.fetchRole();
    this.fetchUsers(); // جلب جميع المستخدمين عند تحميل المكون
  }

  fetchRole() {
    this.role$ = this.userService.roleuser$;
  }

  fetchUsers() {
    this.users$ = this.userService.users$; // جلب جميع المستخدمين من السيرفس
  }
 


 editUser(userId: string) {
    // استرجاع بيانات المستخدم لعرضها في واجهة التعديل
    this.userService.getUserById(userId).subscribe(user => {
      // تحديث بيانات المستخدم في المكون ليتم عرضها في واجهة التعديل
      this.openEditDialog(user); // مرر بيانات المستخدم كوسيط إلى النافذة المنبثقة
          //console.log(this.userToEdit.userName);
    });
}

  
  openEditDialog(user: IUser): void {
    const dialogRef = this.dialog.open(EdituserComponent, {
      
      width: '450px',
      data: user // تمرير بيانات المستخدم كبيانات إلى مكون التعديل
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('تم إغلاق النموذج التعديل', result);
      // يمكنك تحديث البيانات في الجدول هنا إذا لزم الأمر
    });
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe({
     next:() => {
        console.log('User deleted successfully');
        // إزالة المستخدم المحذوف من القائمة المرتبطة بالعرض
        this.users$ = this.users$.pipe(
          map(users => users.filter(user => user.id !== userId))
        );
      },
     error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }

  submitForm(form: NgForm) { // تمرير NgForm كمعامل
    if (form.valid) { // التحقق من صحة النموذج
      const { userName, email, password } = form.value; // الحصول على القيم من النموذج
      this.role$.pipe(
        switchMap((role: IRole) => {
          console.log('Role:', role);
  
          const newUser: IUser = {
            userPassword: password,
            userIsStatus: false,
            updatedAt: new Date().toISOString(),
            roleId: role.id,
            id: '',
            role:role,
            userName: userName,
            email: email,
            officeId:undefined
          };
  
          return this.userService.adduser(newUser);
        })
      ).subscribe({
        next: () => {
          console.log('User added successfully:');
          // إضافة المستخدم المضاف حديثًا إلى قائمة المستخدمين المعروضة مباشرة
          this.users$ = this.users$.pipe(
            take(1), // يتم أخذ قائمة المستخدمين للتأكد من عدم تغييرها أثناء الاشتراك
            map(users => [ ...users]) // إضافة المستخدم المضاف حديثًا إلى بداية القائمة المعروضة

          );
          form.resetForm(); // إعادة تعيين النموذج بعد تقديمه بنجاح
        },
        error: () => {
          
          this._snackBar.open('Error adding user: '  , 'Close', );
        }
      });      
    } else {
      console.log('Form is invalid');
    }
  }
  
  toggleStatus(user: IUser) {
    // تبديل حالة المستخدم في الخادم
    this.userService.toggleUserStatus(user.id).subscribe({
        next:(response) => {
            if (response.userIsStatus) {
                // التحقق مما إذا كانت العملية ناجحة بناءً على رمز الاستجابة
                console.log('User activated successfully');
                user.userIsStatus = !user.userIsStatus; // تغيير حالة المستخدم محلياً
                // إضافة المستخدم المحدث إلى قائمة المستخدمين المحلية
             
            } 
        },
        error: (error) => {
            console.error('Error toggling user status:', error);
        }
    });
}
}


  
  



