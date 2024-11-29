import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';

@Component({
    selector: 'app-cierre-fiscal',
    templateUrl: './cierre-fiscal.component.html',
    styleUrl: './cierre-fiscal.component.scss',
    standalone: false
})
export class CierreFiscalComponent {
  public val = new Validacion();




  V_Imprimir(): void {


    document.getElementById("btnReporte-CierreFiscal")?.setAttribute("disabled", "disabled");
   

    
  }

  
}
