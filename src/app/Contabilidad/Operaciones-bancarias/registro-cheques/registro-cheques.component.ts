// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-registro-cheques',
//   templateUrl: './registro-cheques.component.html',
//   styleUrls: ['./registro-cheques.component.scss']
// })
// export class RegistroChequesComponent {

// }
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { iBodega } from 'src/app/Interface/Inventario/i-Bodega';
import { getBodega } from 'src/app/Inventario/Bodega/CRUD/GET/get-Bodega';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
//import { getTransferencia } from '../CRUD/GET/get-Transferencia';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AnularComponent } from 'src/app/SHARED/anular/anular.component';
import { MatDialogRef } from '@angular/material/dialog';
//import { TransferenciaCuentaComponent } from '../transferencia-cuenta/transferencia-cuenta.component';
import { iAsientoDetalle } from 'src/app/Interface/Contabilidad/i-Asiento-Detalle';
import { getCheques } from '../CRUD/GET/get-Cheques';
import { NuevoChequeComponent } from '../nuevo-cheque/nuevo-cheque.component'; 
import { ChequesSaldoComponent } from '../cheque-saldo/cheque-saldo.component';

@Component({
  selector: 'app-registro-cheques',
  templateUrl: './registro-cheques.component.html',
  styleUrls: ['./registro-cheques.component.scss']
})
export class RegistroChequesComponent {

  public val = new Validacion();
  displayedColumns: string[] = ["Fecha",   "CuentaBancaria", "NoCheque", "Beneficiario","Concepto", "TotalDolar", "TotalCordoba", "Anulado"];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  lstBodega: iBodega[] = [];

  public overlaySettings: OverlaySettings = {};
  public lstCheques :  MatTableDataSource<any>

  @ViewChildren(IgxComboComponent)
  public cmbCombo: QueryList<IgxComboComponent>;


  constructor(private cFunciones: Funciones,  private GET_BODEGA : getBodega, private GET : getCheques
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Seleccione una fecha de inicio.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Final", "Seleccione una fecha final.");
    this.val.add("txtBodega", "1", "LEN>=", "0", "Bodega", "");


    this.val.Get("txtFecha1").setValue(this.cFunciones.DateFormat((new Date(this.cFunciones.FechaServer.getFullYear(), this.cFunciones.FechaServer.getMonth() - 1, 1)), "yyyy-MM-dd"));
    this.val.Get("txtFecha2").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));

   this.v_BODEGA();

  }


  

  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  public v_Select_Bodega(event: any) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.val.Get("txtBodega").setValue([event.added]);
    }
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let cmb : any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem.value;
      this.cmbBodega.setSelectedItem(_Item.Codigo);
      this.val.Get("txtBodega").setValue([_Item.Codigo]);

    }
  }



  public v_BODEGA(): void {


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



    this.GET_BODEGA.Get().subscribe(
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

            this.lstBodega = datos[0].d;
            this.v_CargarDatos();

 
          }

        },
        error: (err) => {


          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {}
      }
    );


  }


  public v_CargarDatos(): void {

    document.getElementById("btnRefrescar-RegCheque")?.setAttribute("disabled", "disabled");



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



    this.GET.Get(this.val.Get("txtFecha1").value, this.val.Get("txtFecha2").value, this.val.Get("txtBodega").value).subscribe(
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

            this.lstCheques = new MatTableDataSource(datos[0].d);
     

          }

        },
        error: (err) => {

          
          dialogRef.close();
          document.getElementById("btnRefrescar-RegCheque")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnRefrescar-RegCheque")?.removeAttribute("disabled");


        }
      }
    );


  }


  // public V_EditarCheque(det : any) : void{


    
    
  //   let dialogRef : any = this.cFunciones.DIALOG.getDialogById("wait") ;


  //     if(dialogRef == undefined)
  //     {
  //       dialogRef = this.cFunciones.DIALOG.open(
  //         WaitComponent,
  //         {
  //           panelClass: "escasan-dialog-full-blur",
  //           data: "",
  //           id : "wait"
  //         }
  //       );
  
  //     }


      
  //   this.GET.GetDetalleCuenta(det.IdCheque).subscribe(
  //     {
  //       next: (data) => {


  //         dialogRef.close();
  //         let _json: any = data;

  //         if (_json["esError"] == 1) {
  //           if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
  //             this.cFunciones.DIALOG.open(DialogErrorComponent, {
  //               id: "error-servidor-msj",
  //               data: _json["msj"].Mensaje,
  //             });
  //           }
  //         } else {

  //           let datos: iDatos[] = _json["d"];

          
  //             let dialogTransf: MatDialogRef<NuevoChequeComponent> = this.cFunciones.DIALOG.open(
  //               NuevoChequeComponent,
  //               {
  //                 panelClass: "escasan-dialog-full",
  //                 disableClose: true
  //               }
  //             );
              
              
                
  //             dialogTransf.afterOpened().subscribe(s =>{
  //               dialogTransf.componentInstance.FILA = det;
  //               dialogTransf.componentInstance.esModal = true;


  //               dialogTransf.componentInstance.lstDetalle.data = JSON.parse(JSON.stringify(datos[0].d));


  //               dialogTransf.componentInstance.v_CargarDatos();

  //             });

  //             dialogTransf.afterClosed().subscribe(s =>{
  //               this.v_CargarDatos();
  //             });


     

  //         }

  //       },
  //       error: (err) => {

  //         document.getElementById("btnRefrescar-RegCheque")?.removeAttribute("disabled");
  //         dialogRef.close();

  //         if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
  //           this.cFunciones.DIALOG.open(DialogErrorComponent, {
  //             id: "error-servidor",
  //             data: "<b class='error'>" + err.message + "</b>",
  //           });
  //         }

  //       },
  //       complete: () => {
  //         document.getElementById("btnRefrescar-RegCheque")?.removeAttribute("disabled");


  //       }
  //     }
  //   );








  // }
  public V_EditarCheque(det : any) : void{


    
    
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


      if(det.TipoCheque== "C")
      {
        this.GET.GetDetalleCuenta(det.IdCheque).subscribe(
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
    
              
                  let dialogTransf: MatDialogRef<NuevoChequeComponent> = this.cFunciones.DIALOG.open(
                    NuevoChequeComponent,
                    {
                      panelClass: "escasan-dialog-full",
                      disableClose: true
                    }
                  );
                  
                  
                    
                  dialogTransf.afterOpened().subscribe(s =>{
                    dialogTransf.componentInstance.FILA = det;
                    dialogTransf.componentInstance.esModal = true;
    
    
                    dialogTransf.componentInstance.lstDetalle.data = JSON.parse(JSON.stringify(datos[0].d));
    
    
                    dialogTransf.componentInstance.v_CargarDatos();
    
                  });
    
                  dialogTransf.afterClosed().subscribe(s =>{
                    this.v_CargarDatos();
                  });
    
    
         
    
              }
    
            },
            error: (err) => {
    
              document.getElementById("btnRefrescar-RegCheque")?.removeAttribute("disabled");
              dialogRef.close();
    
              if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor",
                  data: "<b class='error'>" + err.message + "</b>",
                });
              }
    
            },
            complete: () => {
              document.getElementById("btnRefrescar-RegCheque")?.removeAttribute("disabled");
    
    
            }
          }
        );
    
    
    
      }

      else
      {
        this.GET.GetDetalleDocumentos(det.IdCheque).subscribe(
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
    
              
                  let dialogCheque: MatDialogRef<ChequesSaldoComponent> = this.cFunciones.DIALOG.open(
                    ChequesSaldoComponent,
                    {
                      panelClass: "escasan-dialog-full",
                      disableClose: true
                    }
                  );
                  
                  
                    
                  dialogCheque.afterOpened().subscribe(s =>{
                    dialogCheque.componentInstance.FILA = det;
                    dialogCheque.componentInstance.esModal = true;
    
    
                    dialogCheque.componentInstance.FILA.ChequeDocumento = JSON.parse(JSON.stringify(datos[0].d));
                    dialogCheque.componentInstance.Asiento = JSON.parse(JSON.stringify(datos[1].d));
                    dialogCheque.componentInstance.Asiento.AsientosContablesDetalle = JSON.parse(JSON.stringify(datos[2].d));
    
    
                    dialogCheque.componentInstance.v_CargarDatos();
    
                  });
    
                  dialogCheque.afterClosed().subscribe(s =>{
                    this.v_CargarDatos();
                  });
    
    
         
    
              }
    
            },
            error: (err) => {
    
              document.getElementById("btnRefrescar-RegCheque")?.removeAttribute("disabled");
              dialogRef.close();
    
              if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor",
                  data: "<b class='error'>" + err.message + "</b>",
                });
              }
    
            },
            complete: () => {
              document.getElementById("btnRefrescar-RegCheque")?.removeAttribute("disabled");
    
    
            }
          }
        );
    
      }

      
  





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
      dialogRef.componentInstance.val.Get("txtNoDoc").setValue(det.NoCheque);
      dialogRef.componentInstance.val.Get("txtSerie").setValue(det.IdSerie);
      dialogRef.componentInstance.val.Get("txtBodega").setValue(det.CodBodega);
      dialogRef.componentInstance.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(det.Fecha, "yyyy-MM-dd"));
      dialogRef.componentInstance.IdDoc = det.IdCheque;
      dialogRef.componentInstance.Tipo = "Cheque";
    });


    dialogRef.afterClosed().subscribe(s => {
      if(dialogRef.componentInstance.Anulado) this.v_CargarDatos();
    });
  }


  
  ngOnInit(): void {


    this.overlaySettings = {};

    if (window.innerWidth <= 992) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }

  }



  ngDoCheck(): void {
    ///CAMBIO DE FOCO
    this.val.Combo(this.cmbCombo);
    this.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.val.addFocus("txtFecha2", "txtBodega", undefined);
    this.val.addFocus("txtBodega", "btnRefrescar-RegCheque", "click");


  }
  

}

