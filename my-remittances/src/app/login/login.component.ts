import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HomeComponent } from '../admin/homeAdmin/home.component';
import { AuthGuardService } from './auth-guard.service';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[
    HomeComponent,
    RouterModule,
    RouterLink,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {
  loginService = { username: '', password: ''}; 
  showPassword = false;

  constructor(private LoginService: LoginService,
     private router: Router,
     private _snackBar: MatSnackBar) 
 {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (event.url === '/login') {
            // تعيين خلفية معينة عندما يكون المسار هو "/login"
            document.body.style.background = 'linear-gradient(135deg, #2196F3, #E91E63)';
          } else {
            // استعادة الخلفية الافتراضية للصفحة في حالة المسارات الأخرى
            document.body.style.background = 'white'; // أو أي خلفية أخرى ترغب فيها
          }
        }
      });
    }

     login(form: NgForm): void {
      const credentials = {
        username: form.value['username'],
        password: form.value['password']
      };
    
      this.LoginService.login(credentials).subscribe({
        next: (response) => {
          if (response.user && response.user.userIsStatus) {
            localStorage.setItem('token', response.token);
            
            localStorage.setItem('officeId', response.user.officeId); 
            localStorage.setItem('userId', response.user.id); // تخزين الـ ID في localStorage           
            if (response.roles && response.roles.includes('admin')) {
              this.router.navigate(['/admin-dashboard'], { queryParams: { userType: 'admin' } });
            } else {
              this.router.navigate(['/user-dashboard'], { queryParams: { userType: 'user' } });
            }
          } else {
            // عرض رسالة خطأ إذا كانت الحالة ليست true
            this._snackBar.open('Cannot log in. Please check your credentials.', 'Close', {
              duration: 3000,
            });
          }
        },
        error: (error) => {
          console.error('Error logging in:', error);
          this._snackBar.open('Error logging in. Please try again.', 'Close');
        }
      });
    }
  


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  
}  