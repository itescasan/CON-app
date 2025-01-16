import { Component, ViewChild } from '@angular/core';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, UntypedFormBuilder } from '@angular/forms';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { Observable, catchError, map, startWith, tap } from 'rxjs';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { check, month } from '@igniteui/material-icons-extended';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe, formatDate} from '@angular/common';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { DialogRef } from '@angular/cdk/dialog';
import { BlockScrollStrategy, GlobalPositionStrategy, ISizeInfo, IStepChangingEventArgs, IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { iConfCaja } from 'src/app/Interface/Contabilidad/i-ConfCajaChica';
import { iConfC } from 'src/app/Interface/Contabilidad/i-ConfCaja';
import { getConfCajaChica } from './CRUD/GET/get-ConfCajaChica';
import { SerieCajaComponent } from 'src/app/Contabilidad/Ingreso-Caja/serie-caja/serie-caja.component';
import { postConfCajaChica } from './CRUD/POST/post-ConfCajaChica';


@Component({
    selector: 'app-conf-caja-chica',
    templateUrl: './conf-caja-chica.component.html',
    styleUrl: './conf-caja-chica.component.scss',
    standalone: false
})
export class ConfCajaChicaComponent {
  public val = new Validacion();
  inputValue: string = "";
  inputini: string = "";
  imputfin: string = '';
  public overlaySettings: OverlaySettings = {};
  public isEvent: boolean = false;

  public iDatos: iDatos[] = [];

 
  
  public esModal: boolean = false;
 
  displayedColumns: string[] = ["CuentaContable","NombreCuenta","Valor","Serie","Consecutivo","Estado","Editar","changeState"];

  public lstConfCaja = new MatTableDataSource<iConfCaja> ;
  public lstConf: any[] = [];
  public lstCuentasCaja: any[] = []; 
  public lstValorCaja: any[] = [];
  public FILA: iConfC[] = [];

  constructor(private GET: getConfCajaChica, private POST: postConfCajaChica ,private cFunciones : Funciones )
  { 
    this.v_Evento("Iniciar");
  }


  
  public v_Evento(e: string): void {
    switch (e) {
      case "Iniciar":
        this.v_Evento("Limpiar");
        this.v_CargarDatos();
      break;
      case "Limpiar":     

        this.lstConfCaja.data.splice(0, this.lstConfCaja.data.length);
        this.lstValorCaja.splice(0, this.lstValorCaja.length);
        this.lstCuentasCaja.splice(0, this.lstCuentasCaja.length);
        this.lstConfCaja = new MatTableDataSource<iConfCaja> ;
        this.FILA.splice(0, this.FILA.length);
        this.v_CargarDatos();
        
        
      break; 
    }
  }


  public v_CargarDatos(): void {
  
   
    document.getElementById("btnRefrescar")?.setAttribute("disabled", "disabled");

    
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

    this.GET.Get(this.cFunciones.User).subscribe(
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

            let Datos: iDatos[] = _json["d"];
            this.lstValorCaja = Datos[0].d;
            this.lstCuentasCaja = Datos[1].d;
            this.LlenarDatos();
          }

        },
        error: (err) => {


          document.getElementById("btnRefrescar")?.removeAttribute("disabled");
          dialogRef.close();

          this.cFunciones.DIALOG.open(DialogErrorComponent, {
            data: "<b class='error'>" + err.message + "</b>",
          });

        },
        complete: () => { document.getElementById("btnRefrescar")?.removeAttribute("disabled"); }
      }
    ); 

  }

  private LlenarDatos()
  {
    this.lstConfCaja = new MatTableDataSource(this.lstValorCaja);
    
    let Acc : any[] = Object.assign([], this.lstCuentasCaja);

    Acc.forEach(f =>{
              
      let i = this.lstValorCaja.findIndex((w : any) => w.CuentaContable == f.CuentaContable );
      f.Estado = "ABIERTO";
      // f.IdAcceso = -1;     
      if(i != -1) 
      {
        f.Estado = this.lstValorCaja[i].Estado;
        f.IdTecho = this.lstValorCaja[i].IdTecho;
        f.Valor = this.cFunciones.NumFormat(this.lstValorCaja[i].Valor, "2");
        f.Serie = this.lstValorCaja[i].Serie;
        f.Consecutivo =  this.lstValorCaja[i].Consecutivo;
      }     

      if (f.Valor == 0) 
      {
        f.Valor = "0.0";
      }
      if (f.Serie == undefined)
      {
        f.Serie = "S/S";
      }
      if (f.Consecutivo == undefined) {
        f.Consecutivo = 0;
      }
    });


      this.lstConfCaja = new MatTableDataSource(Acc);
      this.lstConfCaja._updateChangeSubscription();      
  }

  public E_ditar(det: iConfCaja) {
    let dialogRef: MatDialogRef<SerieCajaComponent> =  this.cFunciones.DIALOG.open(
      SerieCajaComponent,
      {
        disableClose: true

      }
    );

    dialogRef.componentInstance.mensaje = "<p class='Bold'>Ingrese Configuracion Caja Chica!!!</p>";
    dialogRef.componentInstance.textBoton1 = "ACEPTAR";
    dialogRef.componentInstance.textBoton2 = "CANCELAR";
    
   
    dialogRef.afterClosed().subscribe(s => {
      if (dialogRef.componentInstance.Consecutivo > 0) {
        det.Consecutivo = dialogRef.componentInstance.Consecutivo;
      }
      if (dialogRef.componentInstance.valor != '0.00') {
        det.Valor = dialogRef.componentInstance.valor;
      }
      if (dialogRef.componentInstance.Serie.length > 0) {
        det.Serie = dialogRef.componentInstance.Serie;
      }      
           
              
      })
  }

  public E_ditarState(det: iConfCaja) {
    let dialogRef: MatDialogRef<DialogoConfirmarComponent> =  this.cFunciones.DIALOG.open(
      DialogoConfirmarComponent,
      {
        disableClose: true

      }
    );

    dialogRef.componentInstance.mensaje = "<p class='Bold'>Esta Seguro Cambiar el Estado</p>";
    dialogRef.componentInstance.textBoton1 = (det.Estado == 'ABIERTO' ? 'BLOQUEADO' : "ABIERTO");
    dialogRef.componentInstance.textBoton2 = "CANCELAR";

    dialogRef.afterClosed().subscribe(s => {
      if (dialogRef.componentInstance.retorno == "1") {
        if (det.Estado  == 'ABIERTO' ) {
          det.Estado = "BLOQUEADO";
        }
        else{
          det.Estado = "ABIERTO";
        }
      }
    })
  }

  public v_Guardar() : void{
    this.val.EsValido();


    if (this.val.Errores != "") {
       this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
      }

      let dialogRef: MatDialogRef<WaitComponent> =  this.cFunciones.DIALOG.open(
        WaitComponent,
        {
          panelClass: "escasan-dialog-full-blur",
          data: "",
        }
      );   
    
     
      document.getElementById("btnGuardarCajaChica")?.setAttribute("disabled", "disabled");

      
      this.lstConfCaja.data.forEach(f => {
        let item : iConfC = {} as iConfC;
        item.IdTecho = f.IdTecho;
        item.CuentaContable = f.CuentaContable;
        item.Nombre = f.NombreCuenta;
        item.Valor = Number(f.Valor.replaceAll(",", ""));
        item.Estado = f.Estado;
        item.Serie = f.Serie == 'S/S' ? '' : f.Serie;
        item.Consecutivo = f.Consecutivo 
        this.FILA.push(item);
      });
   

      this.POST.GuardarTechoCajaChica(this.FILA).subscribe(
        {
          next: (data) => {
  
            dialogRef.close();
            let _json : any = data;
    
            if (_json["esError"] == 1) {
              if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor-msj",
                  data: _json["msj"].Mensaje,
                });
              }
            } 
            else {
  
             let Datos: iDatos = _json["d"];
  
  
  
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: Datos.d,
              });
  
              this.v_Evento("Limpiar");
              this.v_CargarDatos();
    
            }
  
          },
          error: (err) => {
            dialogRef.close();
        
            document.getElementById("btnGuardarCajaChica")?.removeAttribute("disabled");
             this.cFunciones.DIALOG.open(DialogErrorComponent, {
              data: "<b class='error'>" + err.message + "</b>",
            });
          },
          complete: () => {
            document.getElementById("btnGuardarCajaChica")?.removeAttribute("disabled");
          }
        }
      );


    }


}
