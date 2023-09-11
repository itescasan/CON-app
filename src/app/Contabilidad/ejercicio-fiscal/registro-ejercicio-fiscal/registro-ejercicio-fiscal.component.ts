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

    public v_Editar(e : iEjercicioFiscal) : void{

     
    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );




      this.GET.GetPeriodo(e.IdEjercicio).subscribe(
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

              dialofEjercicio.componentInstance.v_CargarDatos();        
            
              dialofEjercicio.afterOpened().subscribe(s =>{
                dialofEjercicio.componentInstance.esModal = true;

                dialofEjercicio.componentInstance.Fila = e;
                dialofEjercicio.componentInstance.val.Get("idEjercicioFiscal").setValue(e.Nombre);
                dialofEjercicio.componentInstance.val.Get("chkBloqueadaEF").setValue(e.Estado == "ABIERTO" ? true : false);
                dialofEjercicio.componentInstance.val.Get("idFechaIni").setValue((new Date(e.FechaInicio).getFullYear()));
            
                let i_Cuenta: iCuenta = dialofEjercicio.componentInstance.lstCuenta.find(f => f.CuentaContable == e.CuentaContableAcumulada)!;
                dialofEjercicio.componentInstance.val.Get("txtCuentaA").setValue(i_Cuenta.Filtro);

                let i_Cuenta2: iCuenta = dialofEjercicio.componentInstance.lstCuenta.find(f => f.CuentaContable == e.CuentaPerdidaGanancia)!;
                dialofEjercicio.componentInstance.val.Get("txtCuentaP").setValue(i_Cuenta2.Filtro);

                let i_Cuenta3: iCuenta = dialofEjercicio.componentInstance.lstCuenta.find(f => f.CuentaContable == e.CuentaContablePeriodo)!;
                dialofEjercicio.componentInstance.val.Get("txtCuentaPr").setValue(i_Cuenta3.Filtro);
                
                
                dialofEjercicio.componentInstance.lstPeriodo = new  MatTableDataSource(datos[0].d);


                document.getElementById("idEjercicioFiscal")?.setAttribute("disabled", "disabled");
                document.getElementById("idFechaIni")?.setAttribute("disabled", "disabled");
                document.getElementById("txtCuentaA")?.setAttribute("disabled", "disabled");
                document.getElementById("txtCuentaP")?.setAttribute("disabled", "disabled");
                document.getElementById("txtCuentaPr")?.setAttribute("disabled", "disabled");
               
          
                let chk: any = document.querySelector("#chkBloqueadaEF");
                chk.bootstrapToggle("on");
                if(e.Estado == "CERRADO") chk.bootstrapToggle("off");
          
          
              });
          
              dialofEjercicio.afterClosed().subscribe(s =>{this.v_CargarDatos()});
            
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
