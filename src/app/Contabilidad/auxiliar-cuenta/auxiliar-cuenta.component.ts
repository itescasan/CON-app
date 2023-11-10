import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings, scaleInCenter, scaleOutCenter } from 'igniteui-angular';
import { iAuxiliarCuenta } from 'src/app/Interface/Contabilidad/i-Auxiliar-Cuenta';
import { iBodega } from 'src/app/Interface/Inventario/i-Bodega';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { getAuxiliarCuenta } from './CRUD/GET/get-Auxiliar-Cuenta';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { MatDialogRef } from '@angular/material/dialog';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { AsientoContableComponent } from '../asiento-contable/nuevo-asiento-contable/asiento-contable/asiento-contable.component';
import { iAsiento } from 'src/app/Interface/Contabilidad/i-Asiento';
import { getBodega } from 'src/app/Inventario/Bodega/CRUD/GET/get-Bodega';

@Component({
  selector: 'app-auxiliar-cuenta',
  templateUrl: './auxiliar-cuenta.component.html',
  styleUrls: ['./auxiliar-cuenta.component.scss']
})
export class AuxiliarCuentaComponent {
  public val = new Validacion();
  displayedColumns: string[] = ["Fecha", "Cuenta", "NoDoc", "Referencia", "DEBE", "HABER", "Cuenta_Padre"];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  public lstAuxiliar: MatTableDataSource<iAuxiliarCuenta>;
  public SaldoInicial: number = 0;
  public SaldoFinal: number = 0;

  lstBodega: iBodega[] = [];

  public overlaySettings: OverlaySettings = {};

  @ViewChildren(IgxComboComponent)
  public cmbCombo: QueryList<IgxComboComponent>;


  constructor(private cFunciones: Funciones, private GET: getAuxiliarCuenta, private GET_BODEGA : getBodega
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Seleccione una fecha de inicio.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Final", "Seleccione una fecha final.");
    this.val.add("txtBodega", "1", "LEN>=", "0", "Bodega", "");
    this.val.add("txtCuenta-Asiento", "1", "LEN>=", "0", "Cuenta", "");

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



  public v_Buscar(det: iAuxiliarCuenta, e: string) {
    let Cuenta: string = e == 'P' ? det.Cuenta_Padre : det.Cuenta;

    this.val.Get("txtCuenta-Asiento").setValue(Cuenta);
    this.v_CargarDatos();
  }


  public v_Editar(e: iAuxiliarCuenta): void {


    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
        id: "wait"
      }
    );


    this.GET.GetAsiento(e.NoDoc, e.Serie).subscribe(
      {
        next: (data) => {


          
   
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

            let Asiento : iAsiento = datos[0].d[0];


            let dialogAsiento: MatDialogRef<AsientoContableComponent> = this.cFunciones.DIALOG.open(
              AsientoContableComponent,
              {
                panelClass: "escasan-dialog-full",
                disableClose: true,
              }
            );
            dialogAsiento.componentInstance.esModal = true;

            dialogAsiento.afterOpened().subscribe(s => {


              
              dialogAsiento.componentInstance.FILA = Asiento;
              dialogAsiento.componentInstance.esAuxiliar = (e.Editar == 1? false : true);
            


            });



            dialogAsiento.afterClosed().subscribe(s => {
              //this.v_CargarDatos();
            });



          }

        },
        error: (err) => {


          dialogRef.close();

          if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => { }
      }
    );





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

    document.getElementById("btnRefrescar-Auxiliar")?.setAttribute("disabled", "disabled");

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



    this.GET.Get(this.val.Get("txtFecha1").value, this.val.Get("txtFecha2").value, this.val.Get("txtBodega").value, this.val.Get("txtCuenta-Asiento").value).subscribe(
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

            let INI: iAuxiliarCuenta = datos[0].d.find((f: any) => f.Serie == "INI");

            this.lstAuxiliar = new MatTableDataSource(datos[0].d.filter((f: any) => f.Serie != "INI"));
            this.SaldoInicial = INI!.DEBE - INI!.HABER;
            this.SaldoFinal = (this.SaldoInicial + this.lstAuxiliar.data.reduce((acc, cur) => acc + cur.DEBE, 0)) - this.lstAuxiliar.data.reduce((acc, cur) => acc + cur.HABER, 0);
            this.lstAuxiliar.paginator = this.paginator;

          }

        },
        error: (err) => {

          document.getElementById("btnRefrescar-Auxiliar")?.removeAttribute("disabled");

          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnRefrescar-Auxiliar")?.removeAttribute("disabled");

        }
      }
    );


  }


  public v_Filtrar(event: any) {
    this.lstAuxiliar.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
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
    this.val.addFocus("txtBodega", "txtCuenta-Asiento", undefined);
    this.val.addFocus("txtCuenta-Asiento", "btnRefrescar-Auxiliar", "click");

  }


}
