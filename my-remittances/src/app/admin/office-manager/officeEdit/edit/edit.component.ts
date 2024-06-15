import { Component, Inject } from '@angular/core'; 
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { Ioffice, officeService } from '../../servece.service'; 
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ 
    ReactiveFormsModule , 
    MatIconModule , //  أيقونة
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
  templateUrl: './edit.component.html', 
  styleUrl: './edit.component.css'
})
export class EditComponent {

  officeToEdit: Ioffice; // المكتب الذي سيتم تحريره
  editForm: FormGroup; // النموذج المستخدم لتحرير المعلومات

  constructor(
    private _snackBar: MatSnackBar,
    private officeService: officeService, // حقن خدمة المكاتب 
    @Inject(MAT_DIALOG_DATA) public data: any, // حقن البيانات الممررة إلى حوار التحرير
  ) 
  {
    
    this.officeToEdit = this.data.office; // تعيين المكتب المحدد
    this.editForm = this.data.officeForm; // تعيين النموذج المستخدم للتحرير
  }
  
  submitForm() {
    if (this.editForm.valid) { 
      const formData = this.editForm.value; // الحصول على البيانات المدخلة من النموذج
      Object.assign(this.officeToEdit, formData); // دمج البيانات في المكتب المحدد

      this.officeService.editeoffice(this.officeToEdit.officeId, this.officeToEdit).subscribe({ 
        next: () =>
          {
          },
          error: (error) => { // إذا صار خطأ وقت التحديث
            this._snackBar.open(error, 'Close');
          }
        });
      } else { // إذا كان النموذج غير صالح
        this._snackBar.open('Please fill in all required fields correctly', 'Close');
      }
    }
  }
  