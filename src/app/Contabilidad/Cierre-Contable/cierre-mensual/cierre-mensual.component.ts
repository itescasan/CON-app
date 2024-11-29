import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { postCierreMes } from '../CRUD/POST/post-cierre-mes';
@Component({
    selector: 'app-cierre-mensual',
    templateUrl: './cierre-mensual.component.html',
    styleUrl: './cierre-mensual.component.scss',
    standalone: false
})
export class CierreMensualComponent {
  public val = new Validacion();

  @ViewChild("datepiker", { static: false })
  public datepiker: any;

  constructor(private cFunciones: Funciones, private POST : postCierreMes
    ) {
  
      this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");
      this.val.add("cmbCierreMes", "1", "LEN>", "0", "Moneda", "Selecione una Opcion");
      
  
      this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));
      this.val.Get("cmbCierreMes").setValue(true);
      
    }


  V_Procesar(): void {


    let dialogRef = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
        id: "wait"
      }
    );

    document.getElementById("btnCiere-Mes")?.setAttribute("disabled", "disabled");


    this.POST.Procesar( this.val.Get("cmbCierreMes").value, this.cFunciones.DateFormat(this.val.Get("txtFecha").value, "yyyy-MM-dd")).subscribe(
      {
        next: (data) => {

          dialogRef.close();
          let _json: any = data;

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          }
          else {


            let Datos: iDatos = _json["d"];
            let msj: string = Datos.d;

            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              data: "<p><b class='bold'>" + msj + "</b></p>"
            });


            

          }

        },
        error: (err) => {
          dialogRef.close();

          document.getElementById("btnCiere-Mes")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          document.getElementById("btnCiere-Mes")?.removeAttribute("disabled");
        }
      }
    );
    
  }



  private ngDoCheck() {

    ///CAMBIO DE FOCO
    this.val.addFocus("txtFecha", "cmbCierreMes", undefined);
    this.val.addFocus("cmbCierreMes", "btnCiere-Mes", "click");

    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";
     


  }
}
