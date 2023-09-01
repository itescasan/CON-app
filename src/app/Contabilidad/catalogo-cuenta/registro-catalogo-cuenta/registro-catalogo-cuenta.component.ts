import { Component, ViewChild } from '@angular/core';
import { CatalogoCuentaComponent } from '../nuevo-catalogo-cuenta/catalogo-cuenta.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { getCuentaContable } from '../CRUD/GET/get-CatalogoCuenta';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
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
  displayedColumns: string[] = ["col1"];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
 
 
  
  public lstCuenta : MatTableDataSource<iCuenta>;
 

  constructor(
    private DIALOG: MatDialog, private GET: getCuentaContable
  ) {
    this.val.add("txtBuscar-Cuenta", "1", "LEN>=", "0", "Buscar", "");

    this.v_CargarDatos();

  }


  public v_Editar(e : iCuenta) : void{

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

      dialogRef.componentInstance.v_CargarDatos();

      dialogRef.componentInstance.val.Get("cmbNivel").setValue(e.Nivel);
      dialogRef.componentInstance.val.Get("cmbGrupo").setValue(e.IdGrupo);
      dialogRef.componentInstance.val.Get("txtCuenta").setValue(e.CuentaContable);
      dialogRef.componentInstance.val.Get("txtDescripcion").setValue(e.NombreCuenta);
      dialogRef.componentInstance.val.Get("cmbClase").setValue(e.ClaseCuenta);
      dialogRef.componentInstance.val.Get("cmbNaturaleza").setValue(e.Naturaleza);
      dialogRef.componentInstance.val.Get("chkCuentaBloqueada").setValue(e.Bloqueada);
      dialogRef.componentInstance.val.Get("txtCuentaPadre").setValue(e.CuentaPadre);

      let chk: any = document.querySelector("#chkCuentaBloqueada");
      if(e.Bloqueada) chk.bootstrapToggle("on");


    });

    dialogRef.afterClosed().subscribe(s =>{
      this.v_CargarDatos();
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

          if(this.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => { 
        document.getElementById("btnRefrescar-RegCuenta")?.removeAttribute("disabled");
        this.lstCuenta.filter = this.val.Get("txtBuscar-Cuenta").value.trim().toLowerCase();
      }
      }
    );


  }


}
