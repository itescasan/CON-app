import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { getReporteContable } from '../GET/get-Reporte-Contable';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iCuentaGastos } from 'src/app/Interface/Contabilidad/i-CuentaGastos';
import { IgxComboComponent, OverlaySettings } from 'igniteui-angular';

import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-comparativo-gastos-mensual', 
  templateUrl: './comparativo-gastos-mensual.component.html',
  styleUrl: './comparativo-gastos-mensual.component.scss'
})
export class ComparativoGastosMensualComponent {

  public val = new Validacion();

  lstCuentaGastos: iCuentaGastos[] = [];

  @ViewChild("datepiker", { static: false })
  public datepiker: any;
  public overlaySettings: OverlaySettings = {};


  datosFormulario: FormGroup;

  constructor(private cFunciones: Funciones, private GET: getReporteContable
  ) {

    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Selecione una moneda");
    this.val.add("cmbOpcion", "1", "LEN>", "0", "Moneda", "Selecione una moneda");
    this.val.add("cmbTipo", "1", "LEN>", "0", "Tipo", "Selecione un tipo de reporte");
    this.val.add("cmbSucursales", "1", "LEN>=", "0", "Tipo", "Selecione una Sucursal");
    this.val.add("cmbCentroCosto", "1", "LEN>=", "0", "Tipo", "Selecione un Centro de Costo");


    this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat((new Date(this.cFunciones.FechaServer.getFullYear(), this.cFunciones.FechaServer.getMonth(), 1)), "yyyy-MM-dd"));
    //this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));
    this.val.Get("cmbMoneda").setValue(true);
    this.val.Get("cmbOpcion").setValue(true);    
    this.val.Get("cmbSucursales").setValue(true);
 



    this.v_CargarDatos();
    
  }


  @ViewChild("cmbSucursales", { static: false })
  public cmbSucursales: IgxComboComponent;

  public v_Select_Sucursales(event: any) {
   
    this.val.Get("cmbSucursales").setValue("");
    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbSucursales").setValue(event.newValue);
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbSucursales.close();
      this.cmbSucursales.close();
    }
  }

  public v_Enter_Sucursales(event: any) {
    if (event.key == "Enter") {
      let cmb : any = this.cmbSucursales.dropdown;
      let _Item: iCuentaGastos = cmb._focusedItem.value;
      this.cmbSucursales.setSelectedItem(_Item.CuentaGastosAdmon);
      this.val.Get("cmbSucursales").setValue([_Item.CuentaGastosAdmon]);
      
    }
  }

  V_Imprimir(): void {


    document.getElementById("btnReporte-Comparativo-Gastos-Mensual")?.setAttribute("disabled", "disabled");



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

    
    this.GET.GetComparativoGastosMensual(this.cFunciones.DateFormat(this.val.Get("txtFecha").value, "yyyy-MM-dd"), this.val.Get("cmbOpcion").value,this.val.Get("cmbMoneda").value,
    this.val.Get("cmbSucursales").value[0] == undefined ? '' : this.val.Get("cmbSucursales").value[0]).subscribe(      
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
          document.getElementById("btnReporte-Comparativo-Gastos-Mensual")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Comparativo-Gastos-Mensual")?.removeAttribute("disabled");


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

  v_CargarDatos(): void {

    document.getElementById("btnReporte-Comparativo-Gastos-Mensual")?.setAttribute("disabled", "disabled");



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

    
    this.GET.Datos().subscribe(      
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

            let datos: iDatos[] = _json["d"];            
            this.lstCuentaGastos = datos[4].d;
            


          }

        },
        error: (err) => {


          dialogRef.close();
          document.getElementById("btnReporte-Comparativo-Gastos-Mensual")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Comparativo-Gastos-Mensual")?.removeAttribute("disabled");


        }
      }
    );


  }


  


  ngDoCheck(): void {
    ///CAMBIO DE FOCO

    this.val.addFocus("txtFecha", "cmbOpcion", undefined);
    this.val.addFocus("cmbOpcion", "cmbTipo", undefined);
    this.val.addFocus("cmbTipo", "cmbMoneda", undefined);    
    this.val.addFocus("cmbMoneda", "btnReporte-Comparativo-Gastos-Mensual", "click");
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";


  }


}
