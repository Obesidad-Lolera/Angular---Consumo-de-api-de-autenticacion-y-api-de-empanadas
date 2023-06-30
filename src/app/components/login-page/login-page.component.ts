import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  
  public loginError: boolean = false;
  public loginStatus: boolean = false;
  
  constructor(private api: AuthService, private router: Router, private status: StatusService) {}
  


  sendLogin(credentials: any){

    return this.api.sendLogin(credentials).subscribe( 
      (resultado:any) => {
        localStorage.setItem('accessToken', JSON.stringify(resultado["access_token"]));
        this.status.isLoggedIn = true;
        this.router.navigateByUrl('/');

      },

      (error) => {
        this.loginError = true;

      }

    );
  }
}
