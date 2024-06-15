import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { TransferComponent } from './admin/transfer/transfer.component';
import { HeaderComponent } from './admin/headerAdmin/header.component';
import { LoginComponent } from './login/login.component';
import { filter, map } from 'rxjs';
import { HomeComponent } from './admin/homeAdmin/home.component';
import { UserAddComponent } from './admin/user-manger/user-add.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,TransferComponent,LoginComponent,HomeComponent,UserAddComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'my-remittances';
  constructor( private rout: Router ) {}

 
ngOnInit(): void {
 // this.bodyLogin();
}


  ///تغير على لون الخلفية فقط لا غير 
  bodyLogin() {
    this.rout.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.rout.url.split('/')[1])
    ).subscribe(route => {
      const body = document.getElementsByTagName('body')[0];
      if (route === 'login') { // استبدل 'login' بالطريق المناسب
        body.style.background = 'linear-gradient(to right, #6a11cb, #2575fc, #849ac0)';

      } else {
        body.style.background = 'linear-gradient(to right, #9a11cb, #849ac0)';
      }
    });
  }
}
