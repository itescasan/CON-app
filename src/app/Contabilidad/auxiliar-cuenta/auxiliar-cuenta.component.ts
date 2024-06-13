import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalPositionStrategy, IComboSelectionChangingEventArgs, IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
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
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';

@Component({
  selector: 'app-auxiliar-cuenta',
  templateUrl: './auxiliar-cuenta.component.html',
  styleUrls: ['./auxiliar-cuenta.component.scss']
})
export class AuxiliarCuentaComponent {
  public val = new Validacion();
  displayedColumns: string[] = ["Fecha", "Cuenta", "NoDoc", "Referencia", "DEBE_ML", "HABER_ML", "Cuenta_Padre"];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  public lstAuxiliar: MatTableDataSource<iAuxiliarCuenta>;
  public SaldoInicial: number = 0;
  public SaldoFinal: number = 0;
  public TotalDEBE: number = 0;
  public TotalHABER: number = 0;
  private ReporteAuxiliar: any;
  private ReporteConsolidado: any;
  private CuentaContable : string;
  private TipoCuenta : string;

  lstBodega: iBodega[] = [];

  public overlaySettings: OverlaySettings = {};

  @ViewChildren(IgxComboComponent)
  public cmbCombo: QueryList<IgxComboComponent>;

  @ViewChild("datepiker", { static: false })
  public datepiker: any;


  constructor(private cFunciones: Funciones, private GET: getAuxiliarCuenta, private GET_BODEGA: getBodega
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Seleccione una fecha de inicio.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Final", "Seleccione una fecha final.");
    this.val.add("txtBodega-auxiliar", "1", "LEN>=", "0", "Bodega", "");
    this.val.add("txtCuenta-Asiento", "1", "LEN>=", "0", "Cuenta", "");

    this.val.Get("txtFecha1").setValue(this.cFunciones.DateFormat((new Date(this.cFunciones.FechaServer.getFullYear(), this.cFunciones.FechaServer.getMonth(), 1)), "yyyy-MM-dd"));
    this.val.Get("txtFecha2").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));

    this.v_BODEGA();

  }




  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  public v_Select_Bodega(event: IComboSelectionChangingEventArgs) {

   /* if (event.newValue.length > 1) {
      event.cancel = true;
      return;
    }*/

    if (event.added.length) {
     if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("txtBodega-auxiliar").setValue(event.newValue);
    }
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem.value;
      this.cmbBodega.setSelectedItem(_Item.Codigo);
      this.val.Get("txtBodega-auxiliar").setValue([_Item.Codigo]);

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


    this.GET.GetAsiento(e.IdAsiento, e.NoDoc).subscribe(
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

            let datos: iDatos[] = _json["d"];

            let Asiento: iAsiento = datos[0].d[0];

            let dialogAsiento: MatDialogRef<AsientoContableComponent> = this.cFunciones.DIALOG.open(
              AsientoContableComponent,
              {
                id: "dialog-asiuento",
                panelClass: "escasan-dialog-full",
                disableClose: true,
              }
            );
            dialogAsiento.componentInstance.esModal = true;
            dialogAsiento.componentInstance.FILA = Asiento;
            dialogAsiento.componentInstance.Editar = (e.Editar == 1 ? true : false);


            dialogAsiento.afterOpened().subscribe(s => {



            });



            dialogAsiento.afterClosed().subscribe(s => {

            });



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
        complete: () => { }
      }
    );





  }

  public v_BODEGA(): void {


    let dialogRef: any = this.cFunciones.DIALOG.getDialogById("wait");


    if (dialogRef == undefined) {
      dialogRef = this.cFunciones.DIALOG.open(
        WaitComponent,
        {
          panelClass: "escasan-dialog-full-blur",
          data: "",
          id: "wait"
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
        complete: () => { }
      }
    );


  }


  public v_CargarDatos(): void {

    document.getElementById("btnRefrescar-Auxiliar")?.setAttribute("disabled", "disabled");

    let dialogRef: any = this.cFunciones.DIALOG.getDialogById("wait");


    if (dialogRef == undefined) {
      dialogRef = this.cFunciones.DIALOG.open(
        WaitComponent,
        {
          panelClass: "escasan-dialog-full-blur",
          data: "",
          id: "wait"
        }
      );

    }



    this.GET.Get(this.val.Get("txtFecha1").value, this.val.Get("txtFecha2").value, this.val.Get("txtBodega-auxiliar").value, this.val.Get("txtCuenta-Asiento").value).subscribe(
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
            this.SaldoInicial = INI!.DEBE_ML - INI!.HABER_ML;
            this.TotalDEBE = this.lstAuxiliar.data.reduce((acc, cur) => acc + cur.DEBE_ML, 0);
            this.TotalHABER = this.lstAuxiliar.data.reduce((acc, cur) => acc + cur.HABER_ML, 0);
            this.SaldoFinal = (this.SaldoInicial + this.lstAuxiliar.data.reduce((acc, cur) => acc + cur.DEBE_ML, 0)) - this.lstAuxiliar.data.reduce((acc, cur) => acc + cur.HABER_ML, 0);
            this.lstAuxiliar.paginator = this.paginator;

            this.ReporteAuxiliar = datos[1].d;
            this.CuentaContable = datos[2].d;
            this.TipoCuenta = datos[3].d;
            this.ReporteConsolidado = undefined;
            if(this.TipoCuenta == "D")this.ReporteConsolidado = datos[4].d;


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



  public async V_Imprimir() {


    if(this.TipoCuenta == "D")
    {
      let dialogRef: MatDialogRef<DialogoConfirmarComponent> = this.cFunciones.DIALOG.open(
        DialogoConfirmarComponent,
        {
          panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
          disableClose: true
        }
      );
  
  
  
      dialogRef.afterOpened().subscribe(s => {
        dialogRef.componentInstance.textBoton1 = "CONSOLIDADO";
        dialogRef.componentInstance.textBoton2 = "DETALLE";
        dialogRef.componentInstance.Set_StyleBtn1("width: 150px");
        dialogRef.componentInstance.Set_StyleBtn2("width: 150px");
        dialogRef.componentInstance.SetMensajeHtml("<p style='text-align: center;'><b>IMPRIMIR</b></p><p style='text-align: center'><b style='color: blue'>"+this.CuentaContable+"</b></p>")

      });


       
    dialogRef.afterClosed().subscribe(s => {

      this.V_Reporte(dialogRef.componentInstance.retorno == "1" ? false :  true);
      
      if(dialogRef.componentInstance.retorno == "1")
      {

      }
      else
      {
        this.V_Reporte(true);
      }

    });



      
  
    }
    else
    {
      this.V_Reporte(true);
    }

   



  }


  private V_Reporte(esDetalle : boolean)
  {

    if (this.ReporteAuxiliar == undefined && esDetalle) return;
    if (this.ReporteConsolidado == undefined && !esDetalle) return;

    let byteArray = new Uint8Array(atob( esDetalle ? this.ReporteAuxiliar : this.ReporteConsolidado).split('').map(char => char.charCodeAt(0)));

    var file = new Blob([byteArray], { type: 'application/pdf' });

    let url = URL.createObjectURL(file);

    let tabOrWindow: any = window.open(url, '_blank');
    tabOrWindow.focus();
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
    this.val.addFocus("txtFecha2", "txtBodega-auxiliar", undefined);
    this.val.addFocus("txtBodega-auxiliar", "txtCuenta-Asiento", undefined);
    this.val.addFocus("txtCuenta-Asiento", "btnRefrescar-Auxiliar", "click");

  }

  private ngAfterViewInit() {

    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";
     

  }


}
