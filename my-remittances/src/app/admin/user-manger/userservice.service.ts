import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {
  constructor(private http: HttpClient) { }

  roleuser$=this.http.get<IRole>(`http://localhost:5184/api/User/roleuser`);

  adduser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>('http://localhost:5184/api/User/add', user);
  }

  users$=this.http.get<IUser[]>(`http://localhost:5184/api/User/users`);


    // استدعاء الخدمة لتغيير حالة التشغيل/الإيقاف للمستخدم
    toggleUserStatus(userId: string): Observable<IUser> {
      const url = `http://localhost:5184/api/User/activate/${userId}`;
      return this.http.put<IUser>(url, {});     
    }

     deleteUser(userId: string): Observable<IUser> {
    const url = `http://localhost:5184/api/User/delete/${userId}`;
    return this.http.delete<IUser>(url);
  }

  editeUser(userId: string, userData: IUser): Observable<IUser> {
    const url = `http://localhost:5184/api/User/update/${userId}`;
    return this.http.put<IUser>(url, userData);
  }

  getUserById(userId: string): Observable<IUser> {
    const url = `http://localhost:5184/api/User/${userId}`;
  return this.http.get<IUser>(url);
  }
  
  
  getUserByIdprofile(userId: string): Observable<Root> {
    const url = `http://localhost:5184/api/User/${userId}`;
    return this.http.get<Root>(url);
  }





  


  }


  export interface Root {
    user: IUser
    role: IRole
  }


//  http://localhost:5184/api/User/roleuser
export interface IRole {
  users: any[]
  id: string
  name: string
  normalizedName: string
  concurrencyStamp: string
}

export interface IUser {
  userPassword?: string; // إذا كانت الخاصية اختيارية
  userIsStatus: boolean
  updatedAt: string
  roleId: string
  id: string
  userName: string
  email: string
  officeId: string
  role: IRole
}

