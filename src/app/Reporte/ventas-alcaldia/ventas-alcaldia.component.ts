import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { getReporteContable } from '../GET/get-Reporte-Contable';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iBodega } from 'src/app/Interface/Inventario/i-Bodega';
import { iMunicipiosAlcaldias } from 'src/app/Interface/Contabilidad/i-MunicipioAlcaldias';
import { IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { iAccesoCaja } from 'src/app/Interface/Contabilidad/i-AccesoCajaChica';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
    selector: 'app-ventas-alcaldia',
    templateUrl: './ventas-alcaldia.component.html',
    styleUrl: './ventas-alcaldia.component.scss',
    standalone: false
})
export class VentasAlcaldiaComponent {

  public val = new Validacion();
  lstBodega: iBodega[] = [];
  lstMunicipio: iMunicipiosAlcaldias[] = [];  


  @ViewChild("datepiker", { static: false })
  public datepiker: any;
  public overlaySettings: OverlaySettings = {};


  datosFormulario: FormGroup;

  constructor(private cFunciones: Funciones, private GET: getReporteContable
  ) {

    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");
    this.val.add("cmbSucursales", "1", "LEN>", "0", "Moneda", "Selecione una moneda");
    this.val.add("cmbMunicipio", "1", "LEN>", "0", "Moneda", "Selecione una moneda");
  


    this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat((new Date(this.cFunciones.FechaServer.getFullYear(), this.cFunciones.FechaServer.getMonth(), 1)), "yyyy-MM-dd"));
    this.val.Get("cmbSucursales").setValue(true);
    this.val.Get("cmbMunicipio").setValue(true);

    this.v_CargarDatos();
  
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

  public v_Select_Sucursales(event: any) {

    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbSucursales").setValue(event.newValue);     
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbSucursales.close();
      this.cmbSucursales.close();
    }
  }


  @ViewChild("cmbMunicipio", { static: false })
  public cmbMunicipio: IgxComboComponent;
  public v_Select_Municipio(event: any) {

    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbMunicipio").setValue(event.newValue);     
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbMunicipio.close();
      this.cmbMunicipio.close();
    }
  }

  public v_Enter_Municipio(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbMunicipio.dropdown;
      let _Item: iMunicipiosAlcaldias = cmb._focusedItem?.value;
      this.cmbMunicipio.setSelectedItem(_Item?.Municipio);
      this.val.Get("cmbMunicipio").setValue([_Item?.Municipio]);      
    }
  }





  V_Imprimir(): void {


    document.getElementById("btnReporte-Ventas-Alcaldia")?.setAttribute("disabled", "disabled");



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

    
    this.GET.GetVentasAlcaldia(this.cFunciones.DateFormat(this.val.Get("txtFecha").value, "yyyy-MM-dd"),
    this.val.Get("cmbSucursales").value[0] == undefined ? '': this.val.Get("cmbSucursales").value[0],
    this.val.Get("cmbMunicipio").value[0] == undefined ? '' : this.val.Get("cmbMunicipio").value[0]).subscribe(      
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
          document.getElementById("btnReporte-Vemtas-Alcaldia")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Ventas-Alcaldia")?.removeAttribute("disabled");


        }
      }
    );


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
            this.lstBodega = datos[2].d;
            this.lstMunicipio = datos[3].d;
            


          }

        },
        error: (err) => {


          dialogRef.close();
          document.getElementById("btnReporte-Ventas-Alcaldia")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Ventas-Alcaldia")?.removeAttribute("disabled");


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

    this.val.addFocus("txtFecha", "cmbMunicipio", undefined);
    this.val.addFocus("cmbSucursales", "cmbMunicipio", undefined); 
    this.val.addFocus("cmbMunicipio", "btnReporte-Ventas-Alcaldia", "click");   
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";


  }

  
}
