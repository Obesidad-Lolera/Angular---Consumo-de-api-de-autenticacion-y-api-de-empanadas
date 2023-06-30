import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class EmpanadasService {

  private apiUrl = "http://localhost:8001/api/v1/empanada";

  constructor(private http: HttpClient) { }
  


  getEmpanadas(){
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + localStorage.getItem("accessToken") 
      })
    };

    return this.http.get(this.apiUrl, httpOptions);
  }
  
}
