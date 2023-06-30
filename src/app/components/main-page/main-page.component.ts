import { Component, OnInit } from '@angular/core';
import { EmpanadasService } from 'src/app/services/empanadas.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(private api: EmpanadasService) {}

  ngOnInit(): void {
    this.getEmpanadas();
  }

  public empanadas: any[] =[];

  getEmpanadas(){
    this.api.getEmpanadas().subscribe(
      resultadoEmpanadas => {
        for (const e of (resultadoEmpanadas as any)) {
          this.empanadas.push({
            nombre: e.nombre,
            precio: e.precio,
          });
        }
        
      });
  }
  


}
