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
  selector: 'app-estado-resultado',
  templateUrl: './estado-resultado.component.html',
  styleUrl: './estado-resultado.component.scss'
})
export class EstadoResultadoComponent {
  public val = new Validacion();

  lstBodega: iBodega[] = [];
  lstCentroCosto: iCentroCosto[] = [];  

  @ViewChild("datepiker", { static: false })
  public datepiker: any;
  public overlaySettings: OverlaySettings = {};

  GE: boolean = true;
  SU: boolean = false;
  CC: boolean = false;
  datos: string[] = ['GENERAL', 'SUCURSALES', 'C.COSTOS'];
  default: string = 'GENERAL';

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
    this.val.Get("cmbTipo").setValue('GENERAL');
    this.val.Get("cmbSucursales").setValue(true);
    this.val.Get("cmbCentroCosto").setValue(true);

  //   this.datosFormulario = new FormGroup({
  //     datos: new FormControl(null)
  // });
  // // setValue es para agregarle un valor
  //   this.datosFormulario.controls['cmbTipo'].setValue(this.default, 
  // {onlySelf: true});

 

    this.v_CargarDatos();
    
  }
  

  // @ViewChild("cmbTipo", { static: false })
  // public cmbTipo: IgxComboComponent;   

  public v_Select_Tipo() {    
    
    let tipo = this.val.ValForm.get('cmbTipo')?.value
    if (tipo == 'GENERAL') {
      this.GE = true;
      this.SU = false;
      this.CC = false;
      this.val.Get("cmbSucursales").setValue("");
      this.val.Get("cmbCentroCosto").setValue("");
    }
    if (tipo == 'SUCURSALES') {
      this.GE = false;
      this.SU = true;
      this.CC = false;
      this.val.Get("cmbCentroCosto").setValue("");
    } 
    if (tipo == 'C.COSTOS') {
      this.val.Get("cmbSucursales").setValue("");
      this.GE = false;
      this.SU = false;
      this.CC = true;
    }
   
  }
  @ViewChild("cmbSucursales", { static: false })
  public cmbSucursales: IgxComboComponent;
  public v_Enter_Sucursales(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbSucursales.dropdown;
      let _Item: iAccesoCaja = cmb._focusedItem?.value;
      this.cmbSucursales.setSelectedItem(_Item?.CuentaContable);
      this.val.Get("cmbSucursales").setValue([_Item?.CuentaContable]);      
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

  public v_Enter_CentroCosto(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbCentroCosto.dropdown;
      let _Item: iCentroCosto = cmb._focusedItem?.value;
      this.cmbCentroCosto.setSelectedItem(_Item?.Codigo);
      this.val.Get("cmbCentroCosto").setValue([_Item?.Codigo]);      
    }
  }

  public v_Select_Sucursales(event: any) {

    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbSucursales").setValue(event.newValue);     
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbSucursales.close();
      this.cmbSucursales.close();
    }
  }

  V_Imprimir(): void {


    document.getElementById("btnReporte-Estado-Resultado")?.setAttribute("disabled", "disabled");



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

    
    this.GET.GetEstadoResultado(this.cFunciones.DateFormat(this.val.Get("txtFecha").value, "yyyy-MM-dd"), this.val.Get("cmbOpcion").value,this.val.Get("cmbMoneda").value[0],
    this.val.Get("cmbSucursales").value[0] == undefined ? '' : this.val.Get("cmbSucursales").value[0],
    this.val.Get("cmbCentroCosto").value[0] == undefined ? '' : this.val.Get("cmbCentroCosto").value[0]).subscribe(      
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
          document.getElementById("btnReporte-Estado-Resultado")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Estado-Resultado")?.removeAttribute("disabled");


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

    document.getElementById("btnReporte-Estado-Resultado")?.setAttribute("disabled", "disabled");



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
            this.lstCentroCosto = datos[0].d;
            this.lstBodega = datos[1].d;
            


          }

        },
        error: (err) => {


          dialogRef.close();
          document.getElementById("btnReporte-Estado-Resultado")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Estado-Resultado")?.removeAttribute("disabled");


        }
      }
    );


  }


  


  ngDoCheck(): void {
    ///CAMBIO DE FOCO

    this.val.addFocus("txtFecha", "cmbOpcion", undefined);
    this.val.addFocus("cmbOpcion", "cmbTipo", undefined);
    this.val.addFocus("cmbTipo", "cmbMoneda", undefined);    
    this.val.addFocus("cmbMoneda", "btnReporte-Estado-Resultado", "click");
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";


  }


}
