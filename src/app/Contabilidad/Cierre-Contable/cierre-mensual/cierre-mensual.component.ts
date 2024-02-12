import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
@Component({
  selector: 'app-cierre-mensual', 
  templateUrl: './cierre-mensual.component.html',
  styleUrl: './cierre-mensual.component.scss'
})
export class CierreMensualComponent {
  public val = new Validacion();

  constructor(private cFunciones: Funciones
    ) {
  
      this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");
      this.val.add("cmbCierreMes", "1", "LEN>", "0", "Moneda", "Selecione una Opcion");
      
  
      this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));
      this.val.Get("cmbCierreMes").setValue(true);
      
    }


  V_Imprimir(): void {


    document.getElementById("btnReporte-CierreMensual")?.setAttribute("disabled", "disabled");
   

    
  }
}
