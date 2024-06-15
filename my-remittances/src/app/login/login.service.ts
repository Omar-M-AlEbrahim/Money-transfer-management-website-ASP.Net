import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from '../admin/user-manger/userservice.service';

  @Injectable({
    providedIn: 'root'
  })
  export class LoginService {

    getUserProfile(userId: string): Observable<IUser> {
      const url = `${`http://localhost:5184/api/User`}/${userId}`;
      return this.http.get<IUser>(url);
    }
    

    constructor(private http: HttpClient) { }
  
    // تعديل الدالة login لتُرجع نوع المستخدم أيضًا
login(credentials: any): Observable<any> {
  return this.http.post<any>(`http://localhost:5184/api/User/login`, credentials);
}

isLoggedIn(): Observable<boolean> {
  const token = localStorage.getItem('token');
  return of(!!token); // يقوم بإصدار Observable يحمل قيمة true إذا كان التوكن موجودًا وقيمة false إذا كان غير موجود
}

    logout(): void {
      localStorage.removeItem('token'); // حذف التوكن المخزن في التخزين المحلي عند تسجيل الخروج
    }

  }
  export interface LoginResponse {
    token: string;
    userId?: string;
    username?: string;
    expiration?: Date;
  }
