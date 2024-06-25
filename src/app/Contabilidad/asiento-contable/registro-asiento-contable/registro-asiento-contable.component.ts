import { Component, ViewChild, ViewChildren } from '@angular/core';
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
import { IgxComboComponent } from 'igniteui-angular';
import { AnularComponent } from 'src/app/SHARED/anular/anular.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { postAsientoContable } from '../CRUD/POST/post-Asiento-contable';

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
 

  @ViewChild("datepiker", { static: false })
  public datepiker: any;
  
  @ViewChild("datepiker2", { static: false })
  public datepiker2: any;
  
  public lstAsiento : MatTableDataSource<iAsiento>;
 

  constructor(private GET: getAsientoContable, private cFunciones : Funciones, private POST: postAsientoContable
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Seleccione una fecha de inicio.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Final", "Seleccione una fecha final.");
    this.val.add("txtBuscar-Asiento", "1", "LEN>=", "0", "Buscar", "");

    this.val.Get("txtFecha1").setValue(this.cFunciones.DateFormat((new Date(this.cFunciones.FechaServer.getFullYear(), this.cFunciones.FechaServer.getMonth(), 1)), "yyyy-MM-dd"));
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

  public v_Editar(e : iAsiento, Clonar : boolean) : void{

    
    

    document.getElementById("btnRefrescar-RegAsiento")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );



    
    this.GET.GetDetalle(e.IdAsiento).subscribe(
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

            let datos : iDatos = _json["d"];
            e.AsientosContablesDetalle = datos.d
      


            let dialogAsiento: MatDialogRef<AsientoContableComponent> = this.cFunciones.DIALOG.open(
              AsientoContableComponent,
              {
                panelClass: "escasan-dialog-full",
                disableClose: true
              }
            );

            
       
            dialogAsiento.afterOpened().subscribe(s =>{
              dialogAsiento.componentInstance.FILA = e;
              dialogAsiento.componentInstance.esModal = true;
              dialogAsiento.componentInstance.Editar = true;
            if(e.NoDocOrigen != undefined) dialogAsiento.componentInstance.Editar = false;

            dialogAsiento.componentInstance.v_CargarDatos();

          });

          dialogAsiento.afterClosed().subscribe(s =>{
            this.v_CargarDatos();
          });




          
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

      }
      }
    );



    
   

  }


  public V_Anular(det : any) : void{

    let dialogRef: MatDialogRef<AnularComponent> = this.cFunciones.DIALOG.open(
      AnularComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true
      }
    );

    dialogRef.afterOpened().subscribe(s => {
      dialogRef.componentInstance.val.Get("txtNoDoc").setValue(det.NoAsiento);
      dialogRef.componentInstance.val.Get("txtSerie").setValue(det.IdSerie);
      dialogRef.componentInstance.val.Get("txtBodega").setValue(det.Bodega);
      dialogRef.componentInstance.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(det.Fecha, "yyyy-MM-dd"));
      dialogRef.componentInstance.IdDoc = det.IdAsiento;
      dialogRef.componentInstance.Tipo = "Asiento";
    });


    dialogRef.afterClosed().subscribe(s => {
      if(dialogRef.componentInstance.Anulado) this.v_CargarDatos();
    });
  }




  
  //██████████████████████████████████████████POPUP██████████████████████████████████████████████████████

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  public V_Popup(event: MouseEvent, item: iAsiento): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu!.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }


  V_Autorizar(item: iAsiento) : void
  {

    let dialogRef: MatDialogRef<DialogoConfirmarComponent> = this.cFunciones.DIALOG.open(
      DialogoConfirmarComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true
      }
    );



    dialogRef.afterOpened().subscribe(s => {
      dialogRef.componentInstance.textBoton1 = "SI";
      dialogRef.componentInstance.textBoton2 = "NO";
      dialogRef.componentInstance.mensaje = "<p><b>Esta seguro de Autorizar?</b> <br>Asiento: <b> " + item.NoAsiento+"</b><br>Bodega: <b> " + item.Bodega +"</b><br>Referencia: <b>"+item.Referencia+"</b></p>";
    });


    
    dialogRef.afterClosed().subscribe(s => {

      if(dialogRef.componentInstance.retorno == "1")
      {

        document.getElementById("btnRefrescar-RegAsiento")?.setAttribute("disabled", "disabled");


        this.POST.AutorizarAiento(item.IdAsiento, this.cFunciones.User).subscribe(
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
              }
              else {
    
    
                let Datos: iDatos = _json["d"];
     
               let dialogAuto = this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  data: "<p><b class='bold'>" + Datos.d + "</b></p>"
                });
    

                
                dialogAuto.afterClosed().subscribe(s =>{
                  this.v_CargarDatos();
                });
    
               
    
              }
    
            },
            error: (err) => {
              dialogRef.close();
    
              document.getElementById("btnRefrescar-RegAsiento")?.removeAttribute("disabled");
              if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor",
                  data: "<b class='error'>" + err.message + "</b>",
                });
              }
            },
            complete: () => {
              document.getElementById("btnRefrescar-RegAsiento")?.removeAttribute("disabled");
            }
          }
        );

        
      }

    });


  }


  V_Clonar(item: iAsiento) : void
  {
    console.log(item)
    this.v_Editar(item, true);
  }


  

  ngDoCheck(): void{
    ///CAMBIO DE FOCO
    this.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.val.addFocus("txtFecha2", "txtBuscar-Asiento", undefined);
    this.val.addFocus("txtBuscar-Asiento", "btnRefrescar-RegAsiento", "click");

    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker2 != undefined) this.datepiker2.mode="dialog";

    }
    



}
