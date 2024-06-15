import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export  class officeService { 
  constructor(private http: HttpClient) { } 

// الحصول على قائمة المكاتب
  offices$=this.http.get<Ioffice[]>(`http://localhost:5184/api/Office/offices`); 
 // دالة لإضافة مكتب جديد
  addoffice(office: Ioffice): Observable<Ioffice> { 
    return this.http.post<Ioffice>('http://localhost:5184/api/Office/add', office); 
  }
 // دالة للحصول على معلومات مكتب معين بواسطة معرفه
  getofficeById(officeId: string): Observable<Ioffice> {
    return this.http.get<Ioffice>(`http://localhost:5184/api/Office/${officeId}`); 
   }
// دالة لتعديل معلومات مكتب معين
  editeoffice(officeId: string, officeData: Ioffice): Observable<Ioffice> { 
    return this.http.put<Ioffice>(`http://localhost:5184/api/Office/update/${officeId}`, officeData); // استدعاء خدمة التعديل عبر الطلب PUT
  }
}

export interface Ioffice {
  officeId: string // معرف المكتب
  name: string // الاسم
  country: string // البلد
  governorate: string // المحافظة
  city: string // المدينة
  currentBalance: number // الرصيد الحالي
  userId: string // معرف المستخدم
}
