import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { getReporteFinanciero } from '../GET/get-Reporte-FinancierosCNT';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { iGrupoCuenta } from 'src/app/Interface/Contabilidad/i-Grupo-Cuentas';


@Component({
  selector: 'app-reporte-catalogo-cuenta',  
  templateUrl: './reporte-catalogo-cuenta.component.html',
  styleUrl: './reporte-catalogo-cuenta.component.scss',
  standalone: false
})
export class ReporteCatalogoCuentaComponent {

  public val = new Validacion();  

  lstGrupoCuenta: iGrupoCuenta[] = [];

  public overlaySettings: OverlaySettings = {};

  constructor(private cFunciones: Funciones, private GET: getReporteFinanciero
  ) {    

    this.val.add("cmbGrupoC", "1", "LEN>", "0", "Grupo", "Seleccione un Grupo.");    
    this.val.add("cmbEstado", "1", "LEN>", "0", "Estado", "Seleccione un Estado.");

    this.val.Get("cmbGrupoC").setValue(0);
    this.val.Get("cmbEstado").setValue(1);

    this.v_CargarDatos();

  }

  @ViewChild("cmbGrupoC", { static: false })
  public cmbGrupoC: IgxComboComponent;
  public v_Select_cmbGrupoC(event: any) {

    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbGrupoC").setValue(event.newValue);     
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbGrupoC.close();
      this.cmbGrupoC.close();
    }
  }

  public v_Enter_cmbGrupoC(event: any) {
      if (event.key == "Enter") {
        let cmb: any = this.cmbGrupoC.dropdown;
        let _Item: iGrupoCuenta = cmb._focusedItem?.value;
        this.cmbGrupoC.setSelectedItem(_Item?.Nombre);
        this.val.Get("cmbGrupoC").setValue([_Item?.IdGrupo]);   
      }
    }


  v_CargarDatos(): void {

    document.getElementById("btnReporte-CatalogoCuenta")?.setAttribute("disabled", "disabled");

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
    
    this.GET.DatosGC().subscribe(      
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
            this.lstGrupoCuenta = datos[0].d;

          }

        },
        error: (err) => {

          dialogRef.close();
          document.getElementById("btnReporte-CatalogoCuenta")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-CatalogoCuenta")?.removeAttribute("disabled");


        }
      }
    );      

  } 


  V_Imprimir(): void { 
  
  
      document.getElementById("btnReporte-CatalogoCuenta")?.setAttribute("disabled", "disabled");  
  
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
  
      this.GET.GetCatalogoCuentas(this.val.Get("cmbGrupoC").value, this.val.Get("cmbEstado").value).subscribe(
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
            document.getElementById("btnReporte-CatalogoCuenta")?.removeAttribute("disabled");
            if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor",
                data: "<b class='error'>" + err.message + "</b>",
              });
            }
  
          },
          complete: () => {
            document.getElementById("btnReporte-CatalogoCuenta")?.removeAttribute("disabled");  
  
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
      
      this.val.addFocus("cmbGrupoC", "cmbEstado", undefined);
      this.val.addFocus("cmbEstado", "btnReporte-CatalogoCuenta", "click");
    }
  

}
