import { Component, ViewChild } from '@angular/core';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { MatPaginator } from '@angular/material/paginator';
import { iEjercicioFiscal } from 'src/app/Interface/Contabilidad/i-EjercicioFiscal';
import { MatTableDataSource } from '@angular/material/table';
import { getEjercicioFiscal } from '../CRUD/GET/get-EjercicioFiscal';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EjercicioFiscalComponent } from '../nuevo-ejercicio-fiscal/ejercicio-fiscal.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iCuenta } from 'src/app/Interface/Contabilidad/i-Cuenta';

@Component({
  selector: 'app-registro-ejercicio-fiscal',
  templateUrl: './registro-ejercicio-fiscal.component.html',
  styleUrls: ['./registro-ejercicio-fiscal.component.scss']
})
export class RegistroEjercicioFiscalComponent {
  
  public val = new Validacion();
  // displayedColumns: string[] = ["col1"];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
 
 
  public iDatos: iDatos[] = [];

  public lstEjercicio : MatTableDataSource<iEjercicioFiscal>;
  public lstCuenta : MatTableDataSource<iCuenta>;

  displayedColumns: string[] = ["Nombre","FechaInicio","FechaFinal","FechaReg","UsuarioReg","Estado","Editar"];

  constructor(private GET: getEjercicioFiscal, private cFunciones : Funciones
    ) {
      this.val.add("txtBuscar-Cuenta", "1", "LEN>=", "0", "Buscar", "");
  
      this.v_CargarDatos();
  
    }

    
  public v_CargarDatos(): void {

    document.getElementById("btnRefrescar-RegEjercicio")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
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
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {

            let datos : iDatos[] = _json["d"];

            this.lstEjercicio = new MatTableDataSource(datos[0].d); 
            this.lstEjercicio.paginator = this.paginator;

          
          }

        },
        error: (err) => {

          document.getElementById("btnRefrescar-RegCuenta")?.removeAttribute("disabled");

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
          document.getElementById("btnRefrescar-RegCuenta")?.removeAttribute("disabled");
          this.lstEjercicio.filter = this.val.Get("txtBuscar-Cuenta").value.trim().toLowerCase();
        }
      }
    );

    }

    public v_Editar(det : iEjercicioFiscal) : void{

     
    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
        id : "wait"
      }
    );




      this.GET.GetPeriodo(det.IdEjercicio).subscribe(
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

              let dialofEjercicio: MatDialogRef<EjercicioFiscalComponent> = this.cFunciones.DIALOG.open(
                EjercicioFiscalComponent,
                {
                  panelClass: window.innerWidth < 576 ? "escasan-dialog-full" : "",
                  height:  window.innerWidth < 992 ? "100%" : "80%",
                  width:  window.innerWidth < 992 ? "100%" : "60%",
                  disableClose: true
                }
              );

              dialofEjercicio.componentInstance.Fila = det;
              dialofEjercicio.componentInstance.esModal = true;
              dialofEjercicio.componentInstance.v_CargarDatos();

              dialofEjercicio.afterOpened().subscribe(s =>{
                

                
                dialofEjercicio.componentInstance.Fila = det;
                dialofEjercicio.componentInstance.val.Get("idEjercicioFiscal").setValue(det.Nombre);
                dialofEjercicio.componentInstance.val.Get("chkBloqueadaEF").setValue(det.Estado == "ABIERTO" ? true : false);
                dialofEjercicio.componentInstance.val.Get("idFechaIni").setValue((new Date(det.FechaInicio).getFullYear()));
                dialofEjercicio.componentInstance.cmbCuenta.select([det.CuentaContableAcumulada]);
                dialofEjercicio.componentInstance.cmbCuenta2.select([det.CuentaPerdidaGanancia]);
                dialofEjercicio.componentInstance.cmbCuenta3.select([det.CuentaContablePeriodo]);


        
                dialofEjercicio.componentInstance.lstPeriodo = new MatTableDataSource(datos[0].d);
                dialofEjercicio.componentInstance.lstPeriodo._updateChangeSubscription();
         
    
                

              });

              dialofEjercicio.afterClosed().subscribe(s =>{
                this.v_CargarDatos();
              });

                          
            }
  
          },
          error: (err) => {
  
            document.getElementById("btnRefrescar-RegCuenta")?.removeAttribute("disabled");
  
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
            dialogRef.afterClosed().subscribe(s =>{
              this.v_CargarDatos();
            });
          }
        }
      );

    }

    public v_Filtrar(event : any){
      this.lstEjercicio.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    }    

}
