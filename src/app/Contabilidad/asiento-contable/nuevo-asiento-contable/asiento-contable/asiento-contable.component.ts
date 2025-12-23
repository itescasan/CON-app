import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalPositionStrategy, IComboFilteringOptions, IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { iAsientoDetalle } from 'src/app/Interface/Contabilidad/i-Asiento-Detalle';
import { iBodega } from 'src/app/Interface/Inventario/i-Bodega';
import { iCuenta } from 'src/app/Interface/Contabilidad/i-Cuenta';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { getAsientoContable } from '../../CRUD/GET/get-Asiento-contable';
import { iSerie } from 'src/app/Interface/Sistema/i-Serie';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { iAsiento } from 'src/app/Interface/Contabilidad/i-Asiento';
import { postAsientoContable } from '../../CRUD/POST/post-Asiento-contable';
import { iCentroCosto } from 'src/app/Interface/Contabilidad/i-Centro-Costo';
import { MatDialogRef } from '@angular/material/dialog';
import { ImprimirAsientoComponent } from './imprimir-asiento/imprimir-asiento.component';

@Component({
  selector: 'app-asiento-contable',
  templateUrl: './asiento-contable.component.html',
  styleUrls: ['./asiento-contable.component.scss'],
  standalone: false
})
export class AsientoContableComponent {
[x: string]: any;

  public val = new Validacion();
  public valTabla = new Validacion();

  public FILA: iAsiento = {} as iAsiento;
  public NoDocumento : string = "";

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iAsientoDetalle>;

  lstSerie: iSerie[] = [];
  lstBodega: iBodega[] = [];
  lstCuenta: iCuenta[] = [];
  lstCentroCosto: iCentroCosto[] = [];

  public esModal: boolean = false;
  public Editar: boolean = true;
  public dec_TotalDebe: number = 0;
  public dec_TotalHaber: number = 0;
  public dec_Dif: number = 0;
  public TC: number;
  public Estado: string = "Solicitado";
  public load: boolean = false;
  public Clonar: boolean = false
  public Revisado : boolean = false;

  public overlaySettings: OverlaySettings = {};

  @ViewChild("datepiker", { static: false })
  public datepiker: any;




  constructor(public cFunciones: Funciones,
    private GET: getAsientoContable, private POST: postAsientoContable, private changeDetectorRef: ChangeDetectorRef) {

    this.val.add("cmbSerie", "1", "LEN>", "0", "Serie", "Seleccione una serie.");
    this.val.add("txtNoAsiento", "1", "LEN>", "0", "No Asiento", "No se ha configurado en número de asiento.");
    this.val.add("txtBodega-asiento", "1", "LEN>", "0", "Bodega", "Seleccione una bodega.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Ingrese una fecha valida.");
    this.val.add("txtReferenciaDoc", "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
    this.val.add("txtObservaciones", "1", "LEN>", "0", "Observaciones", "Ingrese una observacion.");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Seleccione una moneda.");
    this.val.add("TxtTC", "1", "NUM>", "0", "Tasa Cambio", "No se ha configurado el tipo de cambio.");
    this.val.add("chk-asiento-revisado", "1", "LEN>=", "0", "", "");

    this.v_Evento("Iniciar");
  }




  public v_Evento(e: string): void {
    switch (e) {
      case "Iniciar":
        this.v_Evento("Limpiar");
        this.v_CargarDatos();

        break;

      case "Limpiar":

        this.Revisado = false;
        this.Estado = "Solicitado";
        this.FILA.IdAsiento = -1;
        this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
        this.lstDetalle = new MatTableDataSource<iAsientoDetalle>;

        this.dec_TotalDebe = 0;
        this.dec_TotalHaber = 0;
        this.dec_Dif = 0;

        this.val.Get("cmbSerie").setValue("");
        this.val.Get("txtNoAsiento").setValue("");
        this.cmbBodega?.setSelectedItem([]);
        this.val.Get("txtFecha").setValue(this.cFunciones.ShortFechaServidor());
        this.val.Get("txtReferenciaDoc").setValue("");
        this.val.Get("txtObservaciones").setValue("");
        this.val.Get("cmbMoneda").setValue("COR");
        this.val.Get("TxtTC").setValue(0);

        this.val.Get("txtNoAsiento").disable();
        this.val.Get("TxtTC").disable();

        if (this.lstBodega.length > 0) this.cmbBodega?.setSelectedItem(this.lstBodega[0].Codigo);


        this.V_TasaCambios();

        this.V_Agregar();

        var bod: any = document.getElementById("body");
        if (bod != undefined) bod.style.overflow = "";

        break;
    }
  }


  public V_Revisado()
  {
    this.Revisado = !this.Revisado;


    if (this.cFunciones.DIALOG.getDialogById("wait") == undefined) 
    {
      this.cFunciones.DIALOG.open(
        WaitComponent,
        {
          panelClass: "escasan-dialog-full-blur",
          data: "",
          id: "wait"
        }
      );
    }
   

    document.getElementById("chk-asiento-revisado")?.setAttribute("disabled", "disabled");

    this.FILA.Revisado = this.Revisado;

    this.POST.RevisarAsiento(this.FILA).subscribe(
      {
        next: (data) => {

          this.cFunciones.DIALOG.getDialogById("wait")?.close();
          let _json: any = data;

          if (_json["esError"] == 1) {

            this.Revisado = false


            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }

           
          }
          else {


            let Datos: iDatos = _json["d"];
            this.Revisado = Boolean(Datos.d);

          }

        },
        error: (err) => {
          this.cFunciones.DIALOG.getDialogById("wait")?.close();

          document.getElementById("chk-asiento-revisado")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          document.getElementById("chk-asiento-revisado")?.removeAttribute("disabled");
        }
      }
    );



  }

  @ViewChild("cmbSerie", { static: false })
  public cmbSerie: IgxComboComponent;

  public v_Select_Serie(event: any) {
    this.val.Get("cmbSerie").setValue("");
    if (event.added.length == 1) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbSerie").setValue(event.newValue);
      this.v_Consecutivo();
      this.cmbSerie.close();
    }
  }

  public v_Enter_Serie(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbSerie.dropdown;
      let _Item: iSerie = cmb._focusedItem.value;
      this.cmbSerie.setSelectedItem(_Item);
      this.val.Get("cmbSerie").setValue([_Item]);

    }
  }




  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  public v_Select_Bodega(event: any) {
    this.val.Get("txtBodega-asiento").setValue("");
    if (event.added.length == 1) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("txtBodega-asiento").setValue(event.newValue);
      this.cmbBodega.close();
    }
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem.value;
      this.cmbBodega.setSelectedItem(_Item.Codigo);
      this.val.Get("txtBodega-asiento").setValue([_Item.Codigo]);

    }
  }




  //██████████████████████████████████████████TABLA██████████████████████████████████████████████████████

  public v_Select_Cuenta(event: any, det: iAsientoDetalle): void {

    this.valTabla.Get("txtCuenta-asiento" + det.NoLinea).setValue("");

    if (event.added.length == 1) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);

      let txtCuenta: IgxComboComponent = event.owner


      let i_Cuenta: iCuenta = this.lstCuenta.find(f => f?.CuentaContable == event.newValue)!;

      det.Descripcion = i_Cuenta?.NombreCuenta.replaceAll(i_Cuenta?.CuentaContable, "");
      det.Naturaleza = i_Cuenta?.Naturaleza;

      document.getElementById("txtReferencia" + det.NoLinea)?.removeAttribute("disabled");
      document.getElementById("txtCentroCosto" + det.NoLinea)?.removeAttribute("disabled");
      // document.getElementById("txtDebito" + det.NoLinea)?.setAttribute("disabled", "disabled");
      //document.getElementById("txtCredito" + det.NoLinea)?.setAttribute("disabled", "disabled");

      if (this.FILA?.NoDocOrigen == undefined) {

        //  if (i_Cuenta?.Naturaleza == "D") {
        //document.getElementById("txtDebito" + det.NoLinea)?.removeAttribute("disabled");
        if (Number(det.Credito.replaceAll(",", "")) != 0) {
          det.Debito = det.Credito;
          det.Credito = "0.00";
        }



        //  }

        //   if (i_Cuenta?.Naturaleza == "C") {
        // document.getElementById("txtCredito" + det.NoLinea)?.removeAttribute("disabled");
        if (Number(det.Debito.replaceAll(",", "")) != 0) {
          det.Credito = det.Debito;
          det.Debito = "0.00";
        }

        //  }
      }

      txtCuenta.close();

    }

    this.V_Focus("txtReferencia", det);
    this.V_Calcular();


  }
  public v_Enter_Cuenta(event: any, det: iAsientoDetalle) {

    if (event.key == "Enter") {
      let txtCuenta: any = this.lstCmb.find(f => f.id == "txtCuenta-asiento" + det.NoLinea);

      let cmb: any = txtCuenta.dropdown;

      let _Item: iCuenta = cmb._focusedItem.value;
      //if (!txtCuenta.selection[0]?.CuentaContable.includes(det.CuentaContable[0])) txtCuenta.setSelectedItem(_Item.CuentaContable);
      if (event.oldSelection[0] != event.added[0]) event.newSelection = event.added;
      this.valTabla.Get("txtCuenta-asiento" + det.NoLinea).setValue([_Item.CuentaContable]);
      det.Descripcion = _Item.NombreCuenta.replaceAll(_Item.CuentaContable, "");;
      det.Naturaleza = _Item.Naturaleza;

      txtCuenta.close();
    }

  }


 public FiltroCuentaSinGuion = (collection: iCuenta[], searchValue: string, filteringOptions: IComboFilteringOptions): any[] => {
  if (!searchValue) {
    return collection;
  }

  return collection.filter(item =>
    item.NombreCuenta.replaceAll("-", "").toLowerCase().includes(searchValue.toLowerCase())
  );
};

  public v_Select_CentroCosto(event: any, det: iAsientoDetalle): void {

    if (event.added.length == 1) {

      let txtCentroCosto: IgxComboComponent = event.owner

      if (event.oldSelection[0] != event.added[0]) event.newSelection = event.added;
      det.CentroCosto = event.added[0];
      txtCentroCosto.close();
    }


  }
  public v_Enter_CentroCosto(event: any, det: iAsientoDetalle) {

    if (event.key == "Enter") {
      let txtCentro: any = this.lstCmb.find(f => f.id == "txtCentroCosto" + det.NoLinea);

      let cmb: any = txtCentro.dropdown;

      let _Item: iCentroCosto = cmb._focusedItem.value;
      if (!txtCentro.selection[0]?.Codigo.includes(det.CentroCosto[0])) txtCentro.setSelectedItem(_Item.Codigo);
      this.valTabla.Get("txtCentroCosto" + det.NoLinea).setValue([_Item.Codigo]);
      txtCentro.close();
    }

  }




  public V_Focus(columna: string, det: iAsientoDetalle) {

    if (columna != "NuevaFila") {
      if (columna != "Debito/Credito") {
        document?.getElementById("txt" + columna + det.NoLinea)?.focus();
      }
      else {
        document?.getElementById("txtDebito" + det.NoLinea)?.focus();
      }

      if (columna == "txtDebito") {

        if (Number(det.Credito.replaceAll(",", ""))) {
          det.Credito = "0.00";
        }

      }

    }
    else {

      let i: number = 1;

      if (this.lstDetalle.data.length > 0) i = Math.max(...this.lstDetalle.data.map(o => o.NoLinea))



      if (Number(det.Credito.replaceAll(",", "")) != 0) {
        det.Debito = "0.00";
      }

      if (det.NoLinea != i) return;

      this.V_Agregar();
    }

  }


  public V_FocusOut(columna: string, det: iAsientoDetalle) {


    let vacio = ["0.00", "0", ""];
    if (columna == "txtDebito" && !vacio.includes(det.Debito)) {

      if (Number(det.Credito.replaceAll(",", ""))) {
        det.Credito = "0.00";
      }

    }



    if (columna == "txtCredito" && !vacio.includes(det.Credito)) {

      if (Number(det.Debito.replaceAll(",", ""))) {
        det.Debito = "0.00";
      }

    }


    this.V_Calcular();

  }


  //██████████████████████████████████████████POPUP██████████████████████████████████████████████████████

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  public V_Popup(event: MouseEvent, item: iAsientoDetalle): void {
    event.preventDefault();

    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu!.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }


  V_Agregar() {



    let det: iAsientoDetalle = {} as iAsientoDetalle;
    let i: number = 1;

    if (this.lstDetalle.data.length > 0) i = Math.max(...this.lstDetalle.data.map(o => o.NoLinea)) + 1

    this.valTabla.add("txtCuenta-asiento" + i, "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
    this.valTabla.add("txtReferencia" + i, "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
    this.valTabla.add("txtCentroCosto" + i, "1", "LEN>=", "0", "Centro Costo", "Seleccione un centro de costo.");

    det.IdDetalleAsiento = -1;
    det.IdAsiento = this.FILA.IdAsiento;
    det.NoLinea = i;
    det.CuentaContable = "";
    det.Debito = "0";
    det.DebitoML = 0;
    det.DebitoMS = 0;
    det.Credito = "0";
    det.CreditoML = 0;
    det.CreditoMS = 0;
    det.Modulo = "CON";
    det.Descripcion = "";
    det.Referencia = "";
    det.CentroCosto = "";
    this.lstDetalle.data.push(det);

    this.V_Ordenar(i);



  }

  V_Eliminar(item: iAsientoDetalle) {

    let i = this.lstDetalle.data.findIndex(f => f.NoLinea == item.NoLinea);

    if (i == -1) return;

    this.lstDetalle.data.splice(i, 1);
    this.V_Ordenar(-1);

    this.valTabla.del("txtCuenta-asiento" + item.NoLinea);
    this.valTabla.del("txtReferencia" + item.NoLinea);
    this.valTabla.del("txtCentroCosto" + item.NoLinea);
    this.valTabla.del("txtDebito" + item.NoLinea);
    this.valTabla.del("txtCredito" + item.NoLinea);


  }

  private V_Ordenar(x: number) {

    this.lstDetalle.data = this.lstDetalle.data.sort((a, b) => b.NoLinea - a.NoLinea);

    this.lstDetalle.data = [...this.lstDetalle.data];

    this.V_Calcular();

    if (x == -1) return;




    setTimeout(() => {
      document?.getElementById("txtCuenta-asiento" + x)?.focus();
      document.getElementById("txtReferencia" + x)?.setAttribute("disabled", "disabled");
      document.getElementById("txtCentroCosto" + x)?.setAttribute("disabled", "disabled");


      let txtCuenta: any = this.lstCmb.find(f => f.id == "txtCuenta-asiento" + x);
      if (x > 1) txtCuenta.open();


      this.val.addFocus("txtCuenta-asiento" + x, "txtReferencia" + x, undefined);
      this.val.addFocus("txtReferencia" + x, "txtCentroCosto" + x, undefined);
      this.val.addFocus("txtCentroCosto" + x, "txtDebito" + x, undefined);
      this.val.addFocus("txtDebito" + x, "txtCredito" + x, undefined);




    }, 250);


  }


  public v_Visualizar() {


    this.load = true;


    this.cmbSerie.setSelectedItem(this.FILA.IdSerie);
    this.cmbBodega.setSelectedItem(this.FILA.Bodega);
    this.val.Get("txtNoAsiento").setValue(this.FILA.NoAsiento);
    this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.FILA.Fecha, "yyyy-MM-dd"));
    this.val.Get("txtReferenciaDoc").setValue(this.FILA.Referencia);
    this.val.Get("txtObservaciones").setValue(this.FILA.Concepto);
    this.val.Get("cmbMoneda").setValue(this.FILA.IdMoneda);
    this.val.Get("TxtTC").setValue(this.FILA.TasaCambio);
    this.TC = this.FILA.TasaCambio;
    this.Estado = this.FILA.Estado;
    this.Revisado = this.FILA.Revisado;


    this.val.Get("cmbSerie").disable();
    this.val.Get("txtNoAsiento").disable();






    //this.changeDetectorRef.detach();
    this.lstDetalle.data = JSON.parse(JSON.stringify(this.FILA.AsientosContablesDetalle));
    // this.changeDetectorRef.detectChanges();




    setTimeout(() => {




     // if (this.load) return;


    this.dec_TotalDebe = 0;
    this.dec_TotalHaber = 0;
    this.dec_Dif = 0;



  

      this.lstDetalle.data.forEach(f => {

        
      let Debe = Number(String(f.Debito).replaceAll(",", ""));
      let Haber = Number(String(f.Credito).replaceAll(",", ""));


        this.valTabla.add("txtCuenta-asiento" + f.NoLinea, "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
        this.valTabla.add("txtReferencia" + f.NoLinea, "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
        this.valTabla.add("txtCentroCosto" + f.NoLinea, "1", "LEN>=", "0", "Centro Costo", "Seleccione un centro de costo.");




        f.Debito = this.cFunciones.NumFormat(Number(f.Debito), "2");
        f.Credito = this.cFunciones.NumFormat(Number(f.Credito), "2");



        let txtCuenta: any = this.lstCmb.find(y => y.id == "txtCuenta-asiento" + f.NoLinea);
        //  txtCuenta.select([f.CuentaContable]);

        this.valTabla.Get("txtCuenta-asiento" + f.NoLinea).setValue(f.CuentaContable);
        this.valTabla.Get("txtReferencia" + f.NoLinea).setValue(f.Referencia);


        let txtCentro: any = this.lstCmb.find(y => y.id == "txtCentroCosto" + f.NoLinea);
        //  txtCentro.select([f.CentroCosto]);


        /*  if (!this.Editar) {
           // txtCuenta.disabled = true;
          //  txtCentro.disabled = true;
  
            document.getElementById("txtCuenta-asiento" + f.NoLinea)?.setAttribute("disabled", "disabled");
            document.getElementById("txtReferencia" + f.NoLinea)?.setAttribute("disabled", "disabled");
            document.getElementById("txtCentroCosto" + f.NoLinea)?.setAttribute("disabled", "disabled");
            document.getElementById("txtDebito" + f.NoLinea)?.setAttribute("disabled", "disabled");
            document.getElementById("txtCredito" + f.NoLinea)?.setAttribute("disabled", "disabled");
  
          }*/

            this.dec_TotalDebe += Debe;
            this.dec_TotalHaber += Haber;

      });


      this.dec_Dif = this.cFunciones.Redondeo(this.dec_TotalDebe - this.dec_TotalHaber, "2");


      let dialogRef: any = this.cFunciones.DIALOG.getDialogById("wait");
      if (dialogRef != undefined) dialogRef.close();


      this.load = false;

      if (this.Clonar) {
        this.Editar = false;
        this.esModal = false;
        this.val.Get("txtFecha").setValue(this.cFunciones.ShortFechaServidor());
        this.FILA = {} as iAsiento;
        this.FILA.IdAsiento = -1;
        this.Estado = "Solicitado";
        this.V_TasaCambios();
        this.v_Consecutivo();

      }
    });



  }

  public V_EditarFila(det: any) {
    det.Editar = !det.Editar;

    if (det.Editar) {
      setTimeout(() => {

        let Cuenta: any = det.CuentaContable;
        let Centro: any = det.CentroCosto;


        if (Cuenta instanceof Array) {
          Cuenta = det.CuentaContable[0]
        }



        if (Centro instanceof Array) {
          Centro = det.CentroCosto[0]
        }



        let txtCuenta: any = this.lstCmb.find(y => y.id == "txtCuenta-asiento" + det.NoLinea);
        // txtCuenta.deselectAllItems();
        txtCuenta.select([Cuenta]);



        let txtCentro: any = this.lstCmb.find(y => y.id == "txtCentroCosto" + det.NoLinea);
        //  txtCentro.deselectAllItems();
        txtCentro.select([Centro]);




        if (!this.Editar) {
          txtCuenta.disabled = true;
          txtCentro.disabled = true;

          document.getElementById("txtCuenta-asiento" + det.NoLinea)?.setAttribute("disabled", "disabled");
          document.getElementById("txtReferencia" + det.NoLinea)?.setAttribute("disabled", "disabled");
          document.getElementById("txtCentroCosto" + det.NoLinea)?.setAttribute("disabled", "disabled");
          document.getElementById("txtDebito" + det.NoLinea)?.setAttribute("disabled", "disabled");
          document.getElementById("txtCredito" + det.NoLinea)?.setAttribute("disabled", "disabled");

        }



      }, 250);

    }



  }

  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

  public v_CargarDatos(): void {

    document.getElementById("btnRefrescar-Asiento")?.setAttribute("disabled", "disabled");


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





    this.GET.Datos().subscribe(
      {
        next: (data) => {

          if (!this.esModal) dialogRef.close();
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
            this.lstCuenta = datos[1].d.filter((f: any) => f.ClaseCuenta == "D");
            this.lstCentroCosto = datos[2].d;

            if (this.cmbBodega.selection.length == 0) this.cmbBodega.setSelectedItem(this.lstBodega[0]?.Codigo);

            this.V_TasaCambios();
            this.v_Serie();
            if (this.esModal) this.v_Visualizar();


          }

        },
        error: (err) => {


          document.getElementById("btnRefrescar-Asiento")?.removeAttribute("disabled");
          dialogRef.close();


          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => { document.getElementById("btnRefrescar-Asiento")?.removeAttribute("disabled"); }
      }
    );


  }




  public V_TasaCambios(): void {

    if (this.val.Get("txtFecha").value == undefined) return;


    this.cFunciones.GET.TC(this.val.Get("txtFecha").value).subscribe(
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

            let datos: iDatos = _json["d"];
            this.TC = Number(datos.d);
            this.val.Get("TxtTC").setValue(this.TC);
            this.V_Calcular();
            this.v_Consecutivo();
          }

        },
        error: (err) => {

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
      }
    );
  }

  public v_Serie(): void {

    if (this.cmbBodega.selection.length == 0) return;


    this.cFunciones.GET.Serie(this.val.Get("txtBodega-asiento").value, "Contabilidad").subscribe(
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

            let datos: iDatos = _json["d"];
            this.lstSerie = datos.d;

            this.v_Consecutivo();

          }

        },
        error: (err) => {

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
      }
    );
  }

  public v_Consecutivo(): void {

    if (this.cmbSerie.selection.length == 0) return;


    this.cFunciones.GET.ConsecutivoContabilidad(this.val.Get("cmbSerie").value, this.val.Get("txtFecha").value).subscribe(
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

            let datos: iDatos = _json["d"];
            if (!this.esModal) this.val.Get("txtNoAsiento").setValue(String(datos.d).replaceAll("$", this.cFunciones.DateFormat(this.val.Get("txtFecha").value, "YYYYMM")));


          }

        },
        error: (err) => {

          this.cFunciones.DIALOG.open(DialogErrorComponent, {
            data: "<b class='error'>" + err.message + "</b>",
          });

        },
      }
    );
  }


  public v_Guardar(): void {

    this.val.EsValido();
    this.valTabla.EsValido();


    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }



    if (this.valTabla.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.valTabla.Errores,
      });

      return;
    }

    if (this.dec_Dif != 0) {
      let DilogConfirmar = this.cFunciones.DIALOG.open(DialogoConfirmarComponent, {});

      DilogConfirmar.afterOpened().subscribe(s => {
        DilogConfirmar.componentInstance.mensaje = "<span>Tiene una diferencia de: <b>" + this.cFunciones.NumFormat(this.dec_Dif, "2") + "</b><br>Desea Guardar el documento?</span>"
        DilogConfirmar.componentInstance.textBoton1 = "Si";
        DilogConfirmar.componentInstance.textBoton2 = "No";
      });


      DilogConfirmar.afterClosed().subscribe(s => {

        if (DilogConfirmar.componentInstance.retorno == "1") {
          this.V_POST();
        }

      });

      return;

    }


    this.V_POST();

  }

  private V_POST(): void {

    this.FILA.IdSerie = this.val.Get("cmbSerie").value[0];
    this.FILA.NoAsiento = this.val.Get("txtNoAsiento").value;
    this.FILA.Bodega = this.val.Get("txtBodega-asiento").value[0];
    this.FILA.Fecha = this.val.Get("txtFecha").value;
    this.FILA.Referencia = this.val.Get("txtReferenciaDoc").value;
    this.FILA.Concepto = this.val.Get("txtObservaciones").value;
    this.FILA.IdMoneda = this.val.Get("cmbMoneda").value;
    this.FILA.TasaCambio = this.val.Get("TxtTC").value;
    this.FILA.AsientosContablesDetalle = JSON.parse(JSON.stringify(this.lstDetalle.data));
    this.FILA.Total = this.lstDetalle.data.reduce((acc, cur) => acc + Number(String(cur.Credito).replaceAll(",", "")), 0);
    this.FILA.TotalML = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoML), 0);
    this.FILA.TotalMS = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoMS), 0);
    this.FILA.UsuarioReg = this.cFunciones.User;
    this.FILA.FechaReg = new Date();

    this.FILA.AsientosContablesDetalle.forEach(f => {
      f.CuentaContable = f.CuentaContable[0];
      if (f.CentroCosto != undefined) f.CentroCosto = f.CentroCosto[0];
    });


    if (!this.esModal) {
      this.FILA.IdPeriodo = 0;
      this.FILA.Estado = "SOLICITADO";
      this.FILA.TipoAsiento = "ASIENTO BASE"

    }


    let dialogRef = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
        id: "wait"
      }
    );

    document.getElementById("btnGuardar-Asiento")?.setAttribute("disabled", "disabled");


    this.POST.GuardarAsiento(this.FILA).subscribe(
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


            let Datos: iDatos[] = _json["d"];
            let msj: string = Datos[1].d;

            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              data: "<p><b class='bold'>" + msj + "</b></p>"
            });

   

            if (!this.esModal)
            {
              this.V_GenerarDoc(Datos[0], false);
              this.v_Evento("Limpiar");
            }
      

          }

        },
        error: (err) => {
          dialogRef.close();

          document.getElementById("btnGuardar-Asiento")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          document.getElementById("btnGuardar-Asiento")?.removeAttribute("disabled");
        }
      }
    );



  }


  public V_Calcular(): void {
    if (this.load) return;


    this.dec_TotalDebe = 0;
    this.dec_TotalHaber = 0;
    this.dec_Dif = 0;

    this.lstDetalle.data.forEach(f => {

      let Debe = Number(String(f.Debito).replaceAll(",", ""));
      let Haber = Number(String(f.Credito).replaceAll(",", ""));

      if (this.val.Get("cmbMoneda").value == "COR") {
        f.DebitoML = this.cFunciones.Redondeo(Debe, "2");
        f.DebitoMS = this.cFunciones.Redondeo(f.DebitoML / this.TC, "2");

        f.CreditoML = this.cFunciones.Redondeo(Haber, "2");
        f.CreditoMS = this.cFunciones.Redondeo(f.CreditoML / this.TC, "2");

      }
      else {
        f.DebitoMS = this.cFunciones.Redondeo(Debe, "2");
        f.DebitoML = this.cFunciones.Redondeo(f.DebitoMS * this.TC, "2");

        f.CreditoMS = this.cFunciones.Redondeo(Haber, "2");
        f.CreditoML = this.cFunciones.Redondeo(f.CreditoMS * this.TC, "2");

      }

      this.dec_TotalDebe += Debe;
      this.dec_TotalHaber += Haber;
    });

    this.dec_Dif = this.cFunciones.Redondeo(this.dec_TotalDebe - this.dec_TotalHaber, "2");

  }


  public v_Filtrar(event: any) {
    this.lstDetalle.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }


  public V_Imprimir(Exportar : boolean) {

    let dialogRef: MatDialogRef<ImprimirAsientoComponent> = this.cFunciones.DIALOG.open(
      ImprimirAsientoComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true
      }
    );



    dialogRef.afterOpened().subscribe(s => {
      dialogRef.componentInstance.SetMensajeHtml("<p style='text-align: center;'><b>"+ (Exportar ? "EXPORTAR" : "IMPRIMIR") +"</b></p><p style='text-align: center'><b style='color: blue'>" + this.val.Get("txtNoAsiento").value + "</b></p>")

    });


    dialogRef.afterClosed().subscribe(s => {

      if (dialogRef.componentInstance.retorno == "0") {
        this.V_ImprimirDoc(Exportar, "", dialogRef.componentInstance.Consolidado, dialogRef.componentInstance.Unificado, dialogRef.componentInstance.Modulo);
      }

      if (dialogRef.componentInstance.retorno == "1") {
     
        this.V_ImprimirDoc(Exportar, this.cFunciones.MonedaLocal, dialogRef.componentInstance.Consolidado, dialogRef.componentInstance.Unificado, dialogRef.componentInstance.Modulo);
      }

    });



  }




  
  

  private V_ImprimirDoc(Exportar: boolean, Moneda : string, Consolidado : boolean, Unificado : boolean, Modulo : boolean): void {



  document.getElementById("btnImprimir-asiento")?.setAttribute("disabled", "disabled");

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




  this.GET.GetReporte(this.FILA.IdAsiento, this.NoDocumento, Moneda, Exportar, Consolidado, Unificado, Modulo).subscribe(
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
    
                this.V_GenerarDoc(_json["d"], Exportar);

              }

              

          },
          error: (err) => {

              document.getElementById("btnImprimir-asiento")?.removeAttribute("disabled");

              dialogRef.close();

              if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                  this.cFunciones.DIALOG.open(DialogErrorComponent, {
                      id: "error-servidor",
                      data: "<b class='error'>" + err.message + "</b>",
                  });
              }

          },
          complete: () => {
              document.getElementById("btnImprimir-asiento")?.removeAttribute("disabled");

          }
      }
  );


}


private V_GenerarDoc(Datos: iDatos, Exportar: boolean) {


  let byteArray = new Uint8Array(atob(Datos.d).split('').map(char => char.charCodeAt(0)));

  var file = new Blob([byteArray], { type: (Exportar ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf') });


  let url = URL.createObjectURL(file);

 
  var fileLink = document.createElement('a');
  fileLink.href = url;
  fileLink.download = Datos.Nombre;


  if (Exportar) {

      var fileLink = document.createElement('a');
      fileLink.href = url;
      fileLink.download = Datos.Nombre;
      fileLink.click();
      document.body.removeChild(fileLink);
  }
  else {
      let tabOrWindow: any = window.open('',  '_blank');
      tabOrWindow.document.body.appendChild(fileLink);

      tabOrWindow.document.write("<html><head><title>"+Datos.Nombre+"</title></head><body>"
          + '<embed width="100%" height="100%" name="plugin" src="'+ url+ '" '
          + 'type="application/pdf" internalinstanceid="21"></body></html>');

      tabOrWindow.focus();
  }



}


public V_NombreCuenta(CuentaContable : string) : any{
  return this.lstCuenta.find(f => f.CuentaContable == CuentaContable)?.NombreCuenta;
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


  ngAfterViewInit(): void {
    ///CAMBIO DE FOCO
    this.val.addFocus("cmbSerie", "txtBodega-asiento", undefined);
    this.val.addFocus("txtBodega-asiento", "txtFecha", undefined);
    this.val.addFocus("txtFecha", "txtReferenciaDoc", undefined);
    this.val.addFocus("txtReferenciaDoc", "cmbMoneda", undefined);
    this.val.addFocus("cmbMoneda", "txtObservaciones", undefined);

    $("#offcanvasBottom-asiento").removeAttr("show");
    $("#btnMostrarPie-asiento").trigger("click");

  }






  ngDoCheck() {

    this.valTabla.Combo(this.lstCmb);

    if (window.innerWidth < this.cFunciones.TamanoPantalla("md")) if (this.datepiker != undefined) this.datepiker.mode = "dialog";


    this.lstDetalle.data.forEach(f => {

      this.valTabla.addFocus("txtCuenta-asiento" + f.NoLinea, "txtReferencia" + f.NoLinea, undefined);
      this.valTabla.addFocus("txtReferencia" + f.NoLinea, "txtCentroCosto" + f.NoLinea, undefined);

      this.valTabla.addNumberFocus("txtDebito" + f.NoLinea, 2);
      this.valTabla.addNumberFocus("txtCredito" + f.NoLinea, 2);
    });


  }

  ngOnDestroy() {
    this.lstBodega.splice(0, this.lstBodega.length);
    this.lstSerie.splice(0, this.lstSerie.length);
    this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
    this.lstCentroCosto.splice(0, this.lstCentroCosto.length);

  }


}

