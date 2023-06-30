import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor() {
    if(localStorage.getItem("accessToken") === null)
      this.isLoggedIn = false;
    else 
      this.isLoggedIn = true;
   }

  public isLoggedIn: boolean = false;
}
