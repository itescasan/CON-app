import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { iAsiento } from 'src/app/Interface/Contabilidad/i-Asiento';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { getAsientoContable } from '../CRUD/GET/get-Asiento-contable';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { AsientoContableComponent } from '../nuevo-asiento-contable/asiento-contable/asiento-contable.component';

@Component({
  selector: 'app-registro-asiento-contable',
  templateUrl: './registro-asiento-contable.component.html',
  styleUrls: ['./registro-asiento-contable.component.scss']
})
export class RegistroAsientoContableComponent {
  public val = new Validacion();
  displayedColumns: string[] = ["col1"];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
 
 
  
  public lstAsiento : MatTableDataSource<iAsiento>;
 

  constructor(private GET: getAsientoContable, private cFunciones : Funciones
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Seleccione una fecha de inicio.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Final", "Seleccione una fecha final.");
    this.val.add("txtBuscar-Asiento", "1", "LEN>=", "0", "Buscar", "");

    this.val.Get("txtFecha1").setValue(this.cFunciones.DateFormat((new Date(this.cFunciones.FechaServer.getFullYear(), 0, 1)), "yyyy-MM-dd"));
    this.val.Get("txtFecha2").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));

    this.v_CargarDatos();

  }


  public v_CargarDatos(): void {

    document.getElementById("btnRefrescar-RegAsiento")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );



    this.GET.Get(this.val.Get("txtFecha1").value, this.val.Get("txtFecha2").value).subscribe(
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

            let datos : iDatos[] = _json["d"];

            this.lstAsiento = new MatTableDataSource(datos[0].d);
            this.lstAsiento.paginator = this.paginator;
         

          
          }

        },
        error: (err) => {

          document.getElementById("btnRefrescar-RegAsiento")?.removeAttribute("disabled");

          dialogRef.close();

          if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => { 
        document.getElementById("btnRefrescar-RegAsiento")?.removeAttribute("disabled");
        this.lstAsiento.filter = this.val.Get("txtBuscar-Asiento").value.trim().toLowerCase();
      }
      }
    );


  }


  public v_Filtrar(event : any){
    this.lstAsiento.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  public v_Editar(e : iAsiento) : void{

    let dialogRef: MatDialogRef<AsientoContableComponent> = this.cFunciones.DIALOG.open(
      AsientoContableComponent,
      {
        panelClass: "escasan-dialog-full",
        disableClose: true
      }
    );
    
       
    dialogRef.afterOpened().subscribe(s =>{
      dialogRef.componentInstance.esModal = true;

      dialogRef.componentInstance.v_CargarDatos();
      dialogRef.componentInstance.v_Visualizar(e);

    

    });

    dialogRef.afterClosed().subscribe(s =>{
      this.v_CargarDatos();
    });

   

  }



}
