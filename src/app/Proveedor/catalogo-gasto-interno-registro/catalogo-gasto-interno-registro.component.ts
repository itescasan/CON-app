import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { iGastoInterno } from '../Interface/i-GastoInterno';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { getGastoInterno } from '../CRUD/GET/getGastosInterno';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { MatDialogRef } from '@angular/material/dialog';
import { CatalogoGastoInternoComponent } from '../catalogo-gasto-interno/catalogo-gasto-interno.component';
import { Validacion } from 'src/app/SHARED/class/validacion';

@Component({
    selector: 'app-catalogo-gasto-interno-registro',
    imports: [ReactiveFormsModule, CommonModule, MatPaginatorModule, MatTableModule],
    templateUrl: './catalogo-gasto-interno-registro.component.html',
    styleUrl: './catalogo-gasto-interno-registro.component.scss'
})
export class CatalogoGastoInternoRegistroComponent {

  public val = new Validacion();
  public lstRegistros :  MatTableDataSource<iGastoInterno>;

  displayedColumns: string[] = ["CODIGO"];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;


  public constructor(private cFunciones: Funciones, private GET : getGastoInterno){

    this.val.add("txtBuscar-GastInterno", "1", "LEN>=", "0", "Buscar", "");

    this.V_CargarDatos();
    
  }

  
  public V_CargarDatos(): void {

    document.getElementById("btnRefrescar-GastInterno")?.setAttribute("disabled", "disabled");



    let dialogRef : any = this.cFunciones.DIALOG.getDialogById("wait") ;


      if(dialogRef == undefined)
      {
        dialogRef = this.cFunciones.DIALOG.open(
          WaitComponent,
          {
            panelClass: "escasan-dialog-full-blur",
            data: "",
            id : "wait"
          }
        );
  
      }



    this.GET.Get().subscribe(
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

            this.lstRegistros = new MatTableDataSource(datos.d);
     

          }

        },
        error: (err) => {

          
          dialogRef.close();
          document.getElementById("btnRefrescar-GastInterno")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnRefrescar-GastInterno")?.removeAttribute("disabled");


        }
      }
    );


  }


  public V_Editar(det : iGastoInterno) : void{

    let dialog: MatDialogRef<CatalogoGastoInternoComponent> = this.cFunciones.DIALOG.open(
      CatalogoGastoInternoComponent,
      {
        panelClass: "escasan-dialog-full",
        disableClose: true
      }
    );
    
    
      
    dialog.afterOpened().subscribe(s =>{
      dialog.componentInstance.esModal = true;


      dialog.componentInstance.val.Get("txt_Gast_Codigo").setValue(det.CODIGO);
      dialog.componentInstance.val.Get("cmb_Gast_Estado").setValue(det.ESTADO);
      dialog.componentInstance.val.Get("txt_Gast_Descripcion").setValue(det.DESCRIPCION);
      dialog.componentInstance.cmb_Gast_Cuenta.select([det.CUENTACONTABLE])
      dialog.componentInstance.val.Get("cmb_Gast_Aplica").setValue(det.APLICAREN);
      dialog.componentInstance.val.Get("cmb_Gast_Tipo").setValue(det.TIPO);
      dialog.componentInstance.cmb_Gast_Prov.select([det.COD_PROV]);


    });

    dialog.afterClosed().subscribe(s =>{
      this.V_CargarDatos();
    });


  }

  
  
  public V_Filtrar(event : any){
    this.lstRegistros.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

}
