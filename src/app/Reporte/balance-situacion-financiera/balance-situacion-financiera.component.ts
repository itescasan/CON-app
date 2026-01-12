import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { getReporteFinanciero } from '../GET/get-Reporte-FinancierosCNT';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';

@Component({
    selector: 'app-balance-situacion-financiera',
    templateUrl: './balance-situacion-financiera.component.html',
    styleUrl: './balance-situacion-financiera.component.scss',
    standalone: false
})
export class BalanceSituacionFinancieraComponent {

  public val = new Validacion();

  @ViewChild("datepiker", { static: false })
  public datepiker: any;

  constructor(private cFunciones: Funciones, private GET: getReporteFinanciero
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");
    //this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Selecione una moneda");
    this.val.add("cmbNivel", "1", "LEN>", "0", "Nivel", "Selecione un Nivel");


    this.val.Get("txtFecha1").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));
    //this.val.Get("txtFecha2").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));
    this.val.Get("cmbNivel").setValue(1);
    this.val.Get("cmbMoneda").setValue(1);
  }


  V_Imprimir(): void {


    document.getElementById("btnReporte-BalanceSituacionF")?.setAttribute("disabled", "disabled");



    let dialogRef: any = this.cFunciones.DIALOG.getDialogById("wait");


    if (dialogRef == undefined) {
      dialogRef = this.cFunciones.DIALOG.open(
        WaitComponent,
        {
          panelClass: "escasan-dialog-full-blur",
          data: "",
          id: "wait"
        }
      );

    }


    this.GET.GetBalanceSituacionFinanciera(this.val.Get("cmbMoneda").value, this.cFunciones.DateFormat(this.val.Get("txtFecha1").value, "yyyy-MM-dd"), this.val.Get("cmbNivel").value, true).subscribe(
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
          } else {

            let datos: iDatos = _json["d"];
            this.printPDFS(datos.d);



          }

        },
        error: (err) => {


          dialogRef.close();
          document.getElementById("btnReporte-BalanceSituacionF")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-BalanceSituacionF")?.removeAttribute("disabled");


        }
      }
    );


  }


  async printPDFS(datos: any) {



    let byteArray = new Uint8Array(atob(datos).split('').map(char => char.charCodeAt(0)));

    var file = new Blob([byteArray], { type: 'application/pdf' });

    let url = URL.createObjectURL(file);

    let tabOrWindow : any = window.open(url, '_blank');
    tabOrWindow.focus();





  }



  ngDoCheck(): void {
    ///CAMBIO DE FOCO

    this.val.addFocus("txtFecha1", "cmbMoneda", undefined);
    this.val.addFocus("txtFecha2", "cmbMoneda", undefined);
    this.val.addFocus("cmbMoneda", "btnReporte-BalanceSituacionF", "click");
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";

  }

}
