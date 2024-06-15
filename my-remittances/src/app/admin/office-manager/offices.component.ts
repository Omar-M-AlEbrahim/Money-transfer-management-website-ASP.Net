import { map, switchMap, take } from 'rxjs/operators'; 
import { CommonModule } from '@angular/common'; 
import { Component, OnInit } from '@angular/core'; 
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms'; // استيراد الوحدات الضرورية لإنشاء النماذج
import { MatButtonModule } from '@angular/material/button'; 
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatTableModule } from '@angular/material/table'; 
import { IUser, UserserviceService } from '../user-manger/userservice.service'; 
import { Ioffice, officeService } from './servece.service'; 
import { Observable, combineLatestWith } from 'rxjs'; 
import { EditComponent } from './officeEdit/edit/edit.component'; 
import { MatDialog } from '@angular/material/dialog'; 
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-offices', 
  standalone: true, 
  imports: [ 
    MatIconModule, 
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
  templateUrl: './offices.component.html',
  styleUrl: './offices.component.css' 
})
export class OfficesComponent implements OnInit { 
    officeForm: FormGroup; // النموذج الذي يستخدم لإضافة مكتب جديد
  users$: Observable<IUser[]> = this.userService.users$; // قائمة المستخدمين المتاحة كمتغير قابل للمراقبة
  userOffices$!: Observable<Ioffice[]>; // قائمة المكاتب المتاحة كمتغير قابل للمراقبة

  constructor(private fb: FormBuilder, // إنشاء مثيل من FormBuilder لإنشاء النماذج
              private userService: UserserviceService, // إنشاء مثيل من خدمة المستخدمين
              private officeService: officeService, // إنشاء مثيل من خدمة المكاتب
              private dialog: MatDialog, // إنشاء مثيل من حوار Angular Material
              private _snackBar: MatSnackBar) {} // إنشاء مثيل من شريط الإشعارات Angular Material

  ngOnInit(): void { // دالة
    this.userOffices$ = this.userService.users$.pipe( // استخدام خدمة المستخدمين للحصول على قائمة المستخدمين
      combineLatestWith(this.officeService.offices$), // الجمع بين قائمة المستخدمين وقائمة المكاتب
      map(([users, offices]) => { // تطبيق الدالة map للحصول على قائمة المكاتب مع المعلومات الكاملة
        return offices.map(office => { // استخدام الدالة map لتحويل قائمة المكاتب
          const user = users.find(u => u.id === office.userId); // البحث عن مستخدم معين بواسطة معرف المستخدم
          return { ...office, user: user }; // إعادة بناء كل مكتب بتضمين المعلومات الكاملة للمستخدم
        });
      })
    );

    this.officeForm = this.fb.group({ // إنشاء مجموعة للنموذج المستخدم لإضافة مكتب جديد
      Name: ['', Validators.required], // الاسم: مطلوب
      Country: ['', Validators.required], // البلد: مطلوب
      Governorate: ['', Validators.required], // المحافظة: مطلوبة
      City: ['', Validators.required], // المدينة: مطلوبة
      currentBalance: new FormControl('', [Validators.required, Validators.min(0)]) // الرصيد الحالي: مطلوب ويجب أن يكون أكبر من أو يساوي الصفر
    });
  }

  editOffice(id: string) { // دالة لتحرير مكتب معين
    this.officeService.getofficeById(id).subscribe(office => { // الحصول على بيانات المكتب المحدد بواسطة معرفه
      this.openEditDialog(office); // فتح حوار التحرير بعد الحصول على بيانات المكتب
    });
  }

  openEditDialog(office: Ioffice) { // دالة لفتح حوار التحرير
    const dialogRef = this.dialog.open(EditComponent, { // فتح حوار التحرير
      width: '400px', // عرض الحوار
      data: { // البيانات المرسلة إلى حوار التحرير
        office: office, // المكتب المحدد
        officeForm: this.fb.group({ // النموذج المستخدم في حوار التحرير
          Name: [office.name, Validators.required], // الاسم: مطلوب
          Country: [office.country, Validators.required], // البلد: مطلوب
          Governorate: [office.governorate , Validators.required], // المحافظة: مطلوبة
          City: [office.city, Validators.required], // المدينة: مطلوبة
          userId: [office.userId, Validators.required], // معرف المستخدم: مطلوب
          currentBalance: new FormControl(office.currentBalance, [Validators.required, Validators.min(0)]) // الرصيد الحالي: مطلوب ويجب أن يكون أكبر من أو يساوي الصفر
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => { // استماع لإغلاق حوار التحرير
      if (result) { // إذا تم إرجاع نتيجة
        this.officeService.editeoffice(result.officeId, result).subscribe(() => { // تحديث بيانات المكتب المحدد
          console.log('Office updated successfully'); // إظهار رسالة عند نجاح التحديث
        });
      }
    });
  }

  submitForm(form: NgForm) { // دالة لتقديم النموذج لإضافة مكتب جديد
    if (form.valid) { // التحقق من أن النموذج صالح
      const { Name, Country, Governorate, City, currentBalance, userId } = form.value; // الحصول على قيم الحقول من النموذج
      this.userService.getUserById(userId).subscribe(user => { // الحصول على معلومات المستخدم المحدد
        if (user) { // إذا تم العثور على المستخدم
          this.officeService.addoffice({ // إضافة مكتب جديد
            name: Name, // الاسم
            country: Country, // البلد
            governorate: Governorate, // المحافظة
            city: City, // المدينة
            currentBalance: currentBalance, // الرصيد الحالي
            userId: userId, // معرف المستخدم
            officeId: '', // معرف المكتب (سيتم تعيينه لاحقًا)
          }).subscribe({ // الاشتراك للاستماع إلى الاستجابة
            next: (offf) =>
              {
                console.log('Office added successfully', offf); // إظهار رسالة عند نجاح إضافة المكتب مع البيانات المضافة
                this.userOffices$ = this.userOffices$.pipe( // تحديث قائمة المكاتب بمكتب جديد
                  take(1), // استخدام قائمة المكاتب الحالية مرة واحدة فقط
                  map(office => [ ...office]) // إضافة المكتب الجديد إلى بداية قائمة المكاتب
                );
                form.resetForm(); // إعادة تعيين النموذج بعد إرسال البيانات بنجاح
              },
              error: (error) => { // إذا حدث خطأ أثناء إضافة المكتب
                console.error('Error adding office:', error); // إظهار رسالة الخطأ في وحدة التحكم
                this._snackBar.open('Error adding office', 'Close'); // إظهار رسالة خطأ للمستخدم
              }
            });
          } else { // إذا لم يتم العثور على المستخدم
            console.error('User not found'); // إظهار رسالة الخطأ في وحدة التحكم
            this._snackBar.open('User not found', 'Close'); // إظهار رسالة خطأ للمستخدم
          }
        });
      } else { // إذا كان النموذج غير صالح
        console.log('Form is invalid'); // إظهار رسالة تشير إلى أن النموذج غير صالح
      }
    }
  
    displayedColumns: string[] = ['name', 'country', 'governorate', 'city', 'currentBalance', 'userName', 'actions']; // أعمدة الجدول المعروضة في القائمة
  }
  