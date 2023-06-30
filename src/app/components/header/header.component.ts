import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private api: AuthService, private router: Router, public status: StatusService) {}

  public loggedIn: boolean=false;

  logout(){
    this.api.sendLogout().subscribe();
    localStorage.removeItem("accessToken");
    this.status.isLoggedIn = false;
    this.router.navigateByUrl("/login")
    
  }
}
