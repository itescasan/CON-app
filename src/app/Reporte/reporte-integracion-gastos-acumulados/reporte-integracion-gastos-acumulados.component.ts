import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { getReporteFinanciero } from '../GET/get-Reporte-FinancierosCNT';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iCuentasContables } from 'src/app/Interface/Contabilidad/i-CuentasContables';
import { iCentroCosto } from 'src/app/Interface/Contabilidad/i-Centro-Costo';
import { IgxComboComponent, OverlaySettings } from 'igniteui-angular';

@Component({
  selector: 'app-reporte-integracion-gastos-acumulados',
  templateUrl: './reporte-integracion-gastos-acumulados.component.html',
  styleUrl: './reporte-integracion-gastos-acumulados.component.scss'
})
export class ReporteIntegracionGastosAcumuladosComponent {

  public val = new Validacion();

  lstCuentasContables1: iCuentasContables[] = [];
  lstCentroCosto: iCentroCosto[] = [];

  @ViewChild("datepiker", { static: false })
  public datepiker: any;
  public overlaySettings: OverlaySettings = {};
  

  constructor(private cFunciones: Funciones, private GET: getReporteFinanciero
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");    
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Seleccione una moneda");
    this.val.add("cmbRubro", "1", "LEN>", "0", "Rubro", "Seleccione un Rubro");
    this.val.add("cmbCuentasContables1", "1", "LEN>", "0", "Cuentas", "Seleccione una Cuenta");
    this.val.add("cmbCentroCosto", "1", "LEN>", "0", "CCostos", "Seleccione un Centro de Costo");


    this.val.Get("txtFecha1").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));    
    this.val.Get("cmbMoneda").setValue(1);
    this.val.Get("cmbRubro").setValue(0);

    this.v_CargarDatos();
    
  }


  @ViewChild("cmbCuentasContables1", { static: false })
  public cmbCuentasContables1: IgxComboComponent;
  public v_Select_CuentaContable1(event: any) {

    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbCuentasContables1").setValue(event.newValue);     
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbCuentasContables1.close();
      this.cmbCuentasContables1.close();
    }
  }

  @ViewChild("cmbCentroCosto", { static: false })
  public cmbCentroCosto: IgxComboComponent;
  public v_Select_CentroCosto(event: any) {

    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbCentroCosto").setValue(event.newValue);     
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbCentroCosto.close();
      this.cmbCentroCosto.close();
    }
  }

  public v_Enter_CuentaContable1(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbCuentasContables1.dropdown;
      let _Item: iCuentasContables = cmb._focusedItem?.value;
      this.cmbCuentasContables1.setSelectedItem(_Item?.CuentaContable);
      this.val.Get("cmbCuentasContables1").setValue([_Item?.CuentaContable]);   
    }
  }

  public v_Enter_CentroCosto(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbCentroCosto.dropdown;
      let _Item: iCentroCosto = cmb._focusedItem?.value;
      this.cmbCentroCosto.setSelectedItem(_Item?.Codigo);
      this.val.Get("cmbCentroCosto").setValue([_Item?.Codigo]);   
    }
  }


  v_CargarDatos(): void {

    document.getElementById("btnReporte-IntegracionGastos")?.setAttribute("disabled", "disabled");

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
    
    this.GET.DatosCC().subscribe(      
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
            this.lstCuentasContables1 = datos[0].d;

          }

        },
        error: (err) => {

          dialogRef.close();
          document.getElementById("btnReporte-IntegracionGastos")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-IntegracionGastos")?.removeAttribute("disabled");


        }
      }
    );

    this.GET.DatosCentroCosto().subscribe(      
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
            this.lstCentroCosto = datos[0].d;

          }

        },
        error: (err) => {

          dialogRef.close();
          document.getElementById("btnReporte-IntegracionGastos")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-IntegracionGastos")?.removeAttribute("disabled");


        }
      }
    );

  }


  V_Imprimir(): void {

    document.getElementById("btnReporte-IntegracionGastos")?.setAttribute("disabled", "disabled");

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

    this.GET.GetIntegracionGastosAcumulados(this.cFunciones.DateFormat(this.val.Get("txtFecha1").value, "yyyy-MM-dd"), this.val.Get("cmbRubro").value, this.val.Get("cmbCuentasContables1").value, '', this.val.Get("cmbMoneda").value).subscribe(
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
          document.getElementById("btnReporte-IntegracionGastos")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-IntegracionGastos")?.removeAttribute("disabled");

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
    this.val.addFocus("txtFecha1", "cmbRubro", undefined);
    this.val.addFocus("cmbRubro", "cmbMoneda", undefined);
    this.val.addFocus("cmbMoneda", "btnReporte-IntegracionGastos", "click");
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";

  }

}
