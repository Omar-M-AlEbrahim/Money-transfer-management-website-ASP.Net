import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
 
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    // التحقق إذا كان المستخدم مسجل دخوله أم لا  
    if (this.loginService.isLoggedIn()) {
      return true; // إذا كان مسجلاً دخوله، فسماح له بالوصول
    } else {
      // إذا لم يكن مسجلاً دخوله، قم بتوجيهه إلى صفحة تسجيل الدخول وقم بمنعه من الوصول
      this.router.navigate(['/login']); // توجيه المستخدم إلى صفحة تسجيل الدخول
      return false; // منع الوصول
    }
  }
}
