import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { getReporteContable } from '../GET/get-Reporte-Contable';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iBodega } from 'src/app/Interface/Inventario/i-Bodega';
import { iCentroCosto } from 'src/app/Interface/Contabilidad/i-Centro-Costo';
import { IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { iAccesoCaja } from 'src/app/Interface/Contabilidad/i-AccesoCajaChica';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-libro-diario',  
  templateUrl: './libro-diario.component.html',
  styleUrl: './libro-diario.component.scss'
})
export class LibroDiarioComponent {

  public val = new Validacion();


  @ViewChild("datepiker", { static: false })
  public datepiker: any;
  public overlaySettings: OverlaySettings = {};


  datosFormulario: FormGroup;

  constructor(private cFunciones: Funciones, private GET: getReporteContable
  ) {

    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");
    this.val.add("cmbOpcion", "1", "LEN>", "0", "Moneda", "Selecione una moneda");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Selecione una moneda");
  


    this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat((new Date(this.cFunciones.FechaServer.getFullYear(), this.cFunciones.FechaServer.getMonth(), 1)), "yyyy-MM-dd"));
    this.val.Get("cmbMoneda").setValue(true);
    this.val.Get("cmbOpcion").setValue(true);

 
  
  }


  V_Imprimir(): void {


    document.getElementById("btnReporte-Libro-Diario")?.setAttribute("disabled", "disabled");



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

    
    this.GET.GetLibroDiario(this.cFunciones.DateFormat(this.val.Get("txtFecha").value, "yyyy-MM-dd"),this.val.Get("cmbOpcion").value,this.val.Get("cmbMoneda").value[0]).subscribe(      
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
          document.getElementById("btnReporte-Libro-Diario")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Libro-Diario")?.removeAttribute("disabled");


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

    this.val.addFocus("txtFecha", "cmbMoneda", undefined);
    this.val.addFocus("cmbMoneda", "cmbOpcion", undefined); 
    this.val.addFocus("cmbOpcion", "btnReporte-Libro-Diario", "click");  
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";


  }


}
