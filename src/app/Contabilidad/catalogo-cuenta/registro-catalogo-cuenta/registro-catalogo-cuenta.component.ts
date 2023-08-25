import { Component, ViewChild } from '@angular/core';
import { CatalogoCuentaComponent } from '../nuevo-catalogo-cuenta/catalogo-cuenta.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Validacion } from 'src/SHARED/class/validacion';
import { WaitComponent } from 'src/SHARED/componente/wait/wait.component';
import { getCuentaContable } from '../CRUD/GET/get-CatalogoCuenta';
import { DialogErrorComponent } from 'src/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/SHARED/interface/i-Datos';
import { iCuenta } from 'src/app/Interface/i-Cuenta';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-registro-catalogo-cuenta',
  templateUrl: './registro-catalogo-cuenta.component.html',
  styleUrls: ['./registro-catalogo-cuenta.component.scss'],
})
export class RegistroCatalogoCuentaComponent {

  public val = new Validacion();
  displayedColumns: string[] = ['col1', "col2", "col3", "col4", "col5"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
 
  
  public lstCuenta : MatTableDataSource<iCuenta[]>;
 

  constructor(
    private DIALOG: MatDialog, private GET: getCuentaContable
  ) {
    this.val.add("txtBuscar-Cuenta", "1", "LEN>=", "0", "Buscar", "");

    this.v_CargarDatos();

  }


  public v_Editar(e : any) : void{

    let dialogRef: MatDialogRef<CatalogoCuentaComponent> = this.DIALOG.open(
      CatalogoCuentaComponent,
      {
        panelClass: window.innerWidth < 576 ? "escasan-dialog-full" : "",
        //height:  window.innerWidth < 992 ? "100%" : "80%",
        //width:  window.innerWidth < 992 ? "100%" : "60%",
        disableClose: true
      }
    );
    
       
    dialogRef.afterOpened().subscribe(s =>{
      dialogRef.componentInstance.esModal = true;
    });

   

  }



  public v_Filtrar(event : any){
    this.lstCuenta.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }



  public v_CargarDatos(): void {

    document.getElementById("btnRefrescar-RegCuenta")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );



    this.GET.Get().subscribe(
      {
        next: (data) => {

          
          dialogRef.close();
          let _json: any = data;

          if (_json["esError"] == 1) {
            this.DIALOG.open(DialogErrorComponent, {
              data: _json["msj"].Mensaje,
            });
          } else {

            let datos : iDatos[] = _json["d"];

            this.lstCuenta = new MatTableDataSource(datos[0].d);
            this.lstCuenta.paginator = this.paginator;

          

          }

        },
        error: (err) => {

          document.getElementById("btnRefrescar-RegCuenta")?.removeAttribute("disabled");

          dialogRef.close();

          this.DIALOG.open(DialogErrorComponent, {
            data: "<b class='error'>" + err.message + "</b>",
          });

        },
        complete: () => { document.getElementById("btnRefrescar-RegCuenta")?.removeAttribute("disabled");}
      }
    );


  }


}
