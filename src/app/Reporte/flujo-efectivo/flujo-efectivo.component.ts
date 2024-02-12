import { Component } from '@angular/core';
import { Validacion } from 'src/app/SHARED/class/validacion';

@Component({
  selector: 'app-flujo-efectivo',
  templateUrl: './flujo-efectivo.component.html',
  styleUrl: './flujo-efectivo.component.scss'
})
export class FlujoEfectivoComponent {
  public val = new Validacion();

  V_Imprimir(): void {

 
    document.getElementById("btnReporte-CambioPatrimonio")?.setAttribute("disabled", "disabled");
   

    
  }
}
