import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { getReporteFinanciero } from '../GET/get-Reporte-FinancierosCNT';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iBodega } from 'src/app/Interface/Inventario/i-Bodega';
import { iTipoComprobanteRpt } from 'src/app/Interface/Contabilidad/i-TipoComprobanteRpt';
import { IgxComboComponent, OverlaySettings } from 'igniteui-angular';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { iAsiento } from 'src/app/Interface/Contabilidad/i-Asiento';
import { iAsientosContables } from 'src/app/Interface/Contabilidad/i-AsientosContables';


@Component({
  selector: 'app-comprobantes',  
  templateUrl: './comprobantes.component.html',
  styleUrl: './comprobantes.component.scss'
})
export class ComprobantesComponent {

  public val = new Validacion();

  displayedColumns: string[] = ["IdAsiento","NoAsiento","Fecha","Concepto","Imprimir"];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  lstBodega: iBodega[] = [];
  lstTipoDocumento: iTipoComprobanteRpt[] = [];  
  //public lstAsientosContables :  MatTableDataSource<any>
  lstAsientosContables : iAsientosContables[] = [];

  @ViewChild("datepiker", { static: false })
  public datepiker: any;
  public overlaySettings: OverlaySettings = {};  
  

  constructor(private cFunciones: Funciones, private GET: getReporteFinanciero
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");    
    this.val.add("cmbBodega", "1", "LEN>", "0", "Bodega", "Selecione una Bodega");
    this.val.add("cmbTipoDocumento", "1", "LEN>", "0", "Tipo Doc", "Selecione un Tipo Documento");
    this.val.add("cmbIdSerie", "1", "LEN>", "0", "Serie", "Selecione una Serie");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Selecione una moneda");


    this.val.Get("txtFecha1").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));    
    this.val.Get("cmbMoneda").setValue(1);

    this.v_CargarDatos();
    
  }

  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;
  public v_Select_Bodega(event: any) {

    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbBodega").setValue(event.newValue);     
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbBodega.close();
      this.cmbBodega.close();
    }
  }

  @ViewChild("cmbTipoDocumento", { static: false })
  public cmbTipoDocumento: IgxComboComponent;
  public v_Select_TipoDocumento(event: any) {

    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbTipoDocumento").setValue(event.newValue);     
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbTipoDocumento.close();
      this.cmbTipoDocumento.close();
    }
  }

  @ViewChild("cmbIdSerie", { static: false })
  public cmbIdSerie: IgxComboComponent;
  public v_Select_AsientoContable(event: any) {

    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbIdSerie").setValue(event.newValue); 
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbIdSerie.close();
      this.cmbIdSerie.close();
    }
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem?.value;
      this.cmbBodega.setSelectedItem(_Item?.Codigo);
      this.val.Get("cmbBodega").setValue([_Item?.Codigo]);      
    }
  }

  public v_Enter_TipoDocumento(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbTipoDocumento.dropdown;
      let _Item: iTipoComprobanteRpt = cmb._focusedItem?.value;
      this.cmbTipoDocumento.setSelectedItem(_Item?.IdSerie);
      this.val.Get("cmbTipoDocumento").setValue([_Item?.IdSerie]);   
    }
  }

  public v_Enter_AsientoContable(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbIdSerie.dropdown;
      let _Item: iAsientosContables = cmb._focusedItem?.value;
      this.cmbIdSerie.setSelectedItem(_Item?.NoAsiento);
      this.val.Get("cmbIdSerie").setValue([_Item?.NoAsiento]);   
    }
  }


  v_CargarDatos(): void {

    document.getElementById("btnReporte-Comprobantes")?.setAttribute("disabled", "disabled");



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
            this.lstBodega = datos[0].d;

          }

        },
        error: (err) => {


          dialogRef.close();
          document.getElementById("btnReporte-Comprobantes")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Comprobantes")?.removeAttribute("disabled");


        }
      }
    );


    this.GET.DatosT().subscribe(      
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
            this.lstTipoDocumento = datos[0].d;
            
          }

        },
        error: (err) => {


          dialogRef.close();
          document.getElementById("btnReporte-Comprobantes")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Comprobantes")?.removeAttribute("disabled");


        }
      }
    );

    //ASIENTOS CONTABLES
    this.GET.GetAsientosContables(this.cFunciones.DateFormat(this.val.Get("txtFecha1").value, "yyyy-MM-dd")).subscribe(
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
            this.lstAsientosContables = datos[0].d;
            //this.lstAsientosContables = new MatTableDataSource(datos[0].d);
     

          }

        },
        error: (err) => {

          
          dialogRef.close();
          document.getElementById("btnRefrescar-Regtransferencia")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnRefrescar-Regtransferencia")?.removeAttribute("disabled");


        }
      }
    );

  }


  V_Buscar(): void {

    document.getElementById("btnReporte-Asientos")?.setAttribute("disabled", "disabled");

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

    //ASIENTOS CONTABLES
    this.GET.GetAsientosContables(this.cFunciones.DateFormat(this.val.Get("txtFecha1").value, "yyyy-MM-dd")).subscribe(
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
            this.lstAsientosContables = datos[0].d;
            //this.lstAsientosContables = new MatTableDataSource(datos[0].d);     

          }

        },
        error: (err) => {

          
          dialogRef.close();
          document.getElementById("btnReporte-Asientos")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Asientos")?.removeAttribute("disabled");

        }
      }
    );

  }


  V_Imprimir(): void {

    document.getElementById("btnReporte-Comprobantes")?.setAttribute("disabled", "disabled");

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


    this.GET.GetComprobantes(this.cFunciones.DateFormat(this.val.Get("txtFecha1").value, "yyyy-MM-dd"), this.val.Get("cmbBodega").value, this.val.Get("cmbTipoDocumento").value, this.val.Get("cmbIdSerie").value, this.val.Get("cmbMoneda").value).subscribe(
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
          document.getElementById("btnReporte-Comprobantes")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Comprobantes")?.removeAttribute("disabled");

        }
      }
    );

  }


  V_Imprimir2(det : iAsientosContables): void {

    document.getElementById("btnReporte-Comprobantes")?.setAttribute("disabled", "disabled");

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


    this.GET.GetComprobantes2(det.NoAsiento, this.cFunciones.DateFormat(det.Fecha, "yyyy-MM-dd"), det.Concepto, this.val.Get("cmbMoneda").value).subscribe(
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
          document.getElementById("btnReporte-Comprobantes")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Comprobantes")?.removeAttribute("disabled");

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

    this.val.addFocus("txtFecha1", "cmbBodega", undefined);
    this.val.addFocus("txtFecha2", "cmbBodega", undefined);
    this.val.addFocus("cmbBodega", "cmbTipoDocumento", undefined);
    this.val.addFocus("cmbTipoDocumento", "cmbIdSerie", undefined);
    this.val.addFocus("cmbIdSerie", "cmbMoneda", undefined);
    this.val.addFocus("cmbMoneda", "btnReporte-Comprobantes", "click");
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";

  }

}
