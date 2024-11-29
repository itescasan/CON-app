import { Component } from '@angular/core';
import { Validacion } from 'src/app/SHARED/class/validacion';
@Component({
    selector: 'app-gastos-acumulados',
    templateUrl: './gastos-acumulados.component.html',
    styleUrl: './gastos-acumulados.component.scss',
    standalone: false
})
export class GastosAcumuladosComponent {
  public val = new Validacion();

  V_Imprimir(): void {

 
    document.getElementById("btnReporte-CambioPatrimonio")?.setAttribute("disabled", "disabled");
   

    
  }
}
