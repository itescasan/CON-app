import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { iCuenta } from 'src/app/Interface/Contabilidad/i-Cuenta';
import { iCuentaBancaria } from 'src/app/Interface/Contabilidad/i-Cuenta-Bancaria';
import { iBodega } from 'src/app/Interface/Inventario/i-Bodega';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { getTransferencia } from '../CRUD/GET/get-Transferencia';
import { iAsientoDetalle } from 'src/app/Interface/Contabilidad/i-Asiento-Detalle';
import { iAsiento } from 'src/app/Interface/Contabilidad/i-Asiento';
import { postTrasnferencia } from '../CRUD/POST/post-Transferencia';
import { iTransferenciaPOST } from 'src/app/Interface/Contabilidad/I-transferencia-POST';
import { iTransferencia } from 'src/app/Interface/Contabilidad/i-Transferencia';
import { iCentroCosto } from 'src/app/Interface/Contabilidad/i-Centro-Costo';

@Component({
  selector: 'app-transferencia-cuenta',
  templateUrl: './transferencia-cuenta.component.html',
  styleUrls: ['./transferencia-cuenta.component.scss']
})
export class TransferenciaCuentaComponent {
  public overlaySettings: OverlaySettings = {};
  public val = new Validacion();
  public valTabla = new Validacion();

  private IdMoneda: string = "";

  lstCuenta: iCuenta[] = [];
  public lstCuentabancaria: iCuentaBancaria[] = [];
  lstBodega: iBodega[] = [];
  lstCentroCosto: iCentroCosto[] = [];


  @ViewChildren(IgxComboComponent)
  public cmbCuenta: QueryList<IgxComboComponent>;

  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iAsientoDetalle>;


  public FILA: iTransferencia = {} as iTransferencia;


  public esModal: boolean = false;
  public dec_TotalDebe: number = 0;
  public dec_TotalHaber: number = 0;
  public dec_Dif: number = 0;
  public TC: number;
  public Anulado: boolean = false;


  @ViewChildren(IgxComboComponent)
  public cmbCombo: QueryList<IgxComboComponent>;

  @ViewChild("datepiker", { static: false })
  public datepiker: any;


  constructor(public cFunciones: Funciones, private GET: getTransferencia, private POST: postTrasnferencia) {

    this.val.add("cmbCuentaBancaria", "1", "LEN>", "0", "No Cuenta", "Seleccione una cuenta bancaria.");
    this.val.add("txtNombreCuenta", "1", "LEN>", "0", "Nombre Cuenta", "No se ha definido el nombre de la cuenta.");
    this.val.add("txtBanco", "1", "LEN>", "0", "Banco", "No se ha definido el banco.");
    this.val.add("cmbBodega", "1", "LEN>", "0", "Sucursal", "Seleccione una sucursal.");
    this.val.add("txtNoDoc", "1", "LEN>", "0", "No Doc", "No se ha definido el número de consecutivo.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Ingrese una fecha valida.");
    this.val.add("txtBeneficiario", "1", "LEN>", "0", "Beneficiario", "No se ha especificado el beneficiario de la transferencia.");
    this.val.add("txtMoneda", "1", "LEN>", "0", "Moneda", "No se ha especificado la moneda de la cuenta.");
    this.val.add("TxtTC", "1", "NUM>", "0", "Tasa Cambio", "No se ha configurado el tipo de cambio.");
    this.val.add("txtConcepto", "1", "LEN>", "0", "Concepto", "Ingrese un concepto.");
    this.val.add("txtTotalCordoba", "1", "LEN>=", "0", "Total Cordoba", "");
    this.val.add("txtTotalDolar", "1", "LEN>=", "0", "Total Dolar", "");


    this.v_Evento("Iniciar");

  }




  public v_Evento(e: string): void {
    switch (e) {
      case "Iniciar":
        this.v_Evento("Limpiar");
        this.v_CargarDatos();
        break;

      case "Limpiar":

        this.Anulado = false;
        this.FILA.IdTransferencia = "00000000-0000-0000-0000-000000000000";

        this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
        this.lstDetalle = new MatTableDataSource<iAsientoDetalle>;

        this.dec_TotalDebe = 0;
        this.dec_TotalHaber = 0;
        this.dec_Dif = 0;


        this.val.Get("cmbCuentaBancaria").setValue("");
        this.val.Get("txtNombreCuenta").setValue("");
        this.val.Get("txtBanco").setValue("");
        this.val.Get("cmbBodega").setValue("");
        this.val.Get("txtNoDoc").setValue("");
        this.val.Get("txtFecha").setValue(this.cFunciones.ShortFechaServidor());
        this.val.Get("txtBeneficiario").setValue("");
        this.val.Get("txtMoneda").setValue("");
        this.val.Get("txtConcepto").setValue("");
        this.val.Get("txtTotalDolar").setValue("0.00");
        this.val.Get("txtTotalCordoba").setValue("0.00");


        this.val.Get("txtNombreCuenta").disable();
        this.val.Get("txtBanco").disable();
        this.val.Get("txtNoDoc").disable();
        this.val.Get("txtMoneda").disable();
        //this.val.Get("TxtTC").disable();
        this.val.Get("txtTotalDolar").disable();
        this.val.Get("txtTotalCordoba").disable();


        if (this.lstBodega.length > 0) this.cmbBodega?.setSelectedItem(this.lstBodega[0].Codigo);


        this.V_TasaCambios();

        this.V_Agregar(true);
        this.V_Agregar(false);


        break;
    }
  }



  @ViewChild("cmbCuentaBancaria", { static: false })
  public cmbCuentaBancaria: IgxComboComponent;

  public v_Select_CuentaBanco(event: any) {
    this.val.Get("cmbCuentaBancaria").setValue("");
    if (event.added.length == 1) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let _Item = this.lstCuentabancaria.find(f => f.IdCuentaBanco == event.newValue[0]);

      this.val.Get("cmbCuentaBancaria").setValue(event.newValue[0]);
      this.val.Get("txtNombreCuenta").setValue(_Item?.NombreCuenta);
      this.val.Get("txtBanco").setValue(_Item?.Banco);
      this.val.Get("txtMoneda").setValue(_Item?.Moneda);
      this.val.Get("txtNoDoc").setValue(_Item?.Consecutivo);
      this.IdMoneda = String(_Item?.IdMoneda);

      let i: number = this.V_Agregar(true);


      setTimeout(() => {
        let txtCuenta: any = this.cmbCuenta.find(y => y.id == "txtCuenta" + i);


        txtCuenta.setSelectedItem((this.IdMoneda == this.cFunciones.MonedaLocal ? _Item?.CuentaNuevaC : _Item?.CuentaNuevaD));



      }, 250);

      if (window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbCuentaBancaria.close();

    }
  }

  public v_Enter_CuentaBanco(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbCuentaBancaria.dropdown;
      let _Item: iCuentaBancaria = cmb._focusedItem.value;
      this.cmbCuentaBancaria.setSelectedItem(_Item.IdCuentaBanco);
      this.val.Get("cmbCuentaBancaria").setValue([_Item.IdCuentaBanco]);
    }
  }





  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  public v_Select_Bodega(event: any) {
    this.val.Get("cmbBodega").setValue("");
    if (event.added.length == 1) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbBodega").setValue(event.newValue);
      if (window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbBodega.close();
    }
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem.value;
      this.cmbBodega.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbBodega").setValue([_Item.Codigo]);

    }
  }






  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

  public v_CargarDatos(): void {


    document.getElementById("btnRefrescar-Transferencia")?.setAttribute("disabled", "disabled");


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
            this.lstCuentabancaria = datos[0].d;
            this.lstBodega = datos[1].d;
            this.lstCuenta = datos[2].d.filter((f: any) => f.ClaseCuenta == "D");
            this.lstCentroCosto = datos[3].d;

            if (this.cmbBodega.selection.length == 0) this.cmbBodega.setSelectedItem(this.lstBodega[0]?.Codigo);


            if (this.cmbBodega.selection.length != 0) {
              let i_C = this.lstCuentabancaria.find(f => f.IdCuentaBanco == this.val.Get("cmbCuentaBancaria").value[0])
              this.val.Get("txtNombreCuenta").setValue(i_C?.NombreCuenta);
              this.val.Get("txtBanco").setValue(i_C?.Banco);
              this.val.Get("txtMoneda").setValue(i_C?.Moneda);
              this.val.Get("txtNoDoc").setValue(i_C?.Consecutivo);
              this.IdMoneda = String(i_C?.IdMoneda);
              this.V_Calcular();
            }



            this.V_TasaCambios();
            if (this.esModal) this.v_Visualizar();


          }

        },
        error: (err) => {


          dialogRef.close();
          document.getElementById("btnRefrescar-Transferencia")?.removeAttribute("disabled");

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => { document.getElementById("btnRefrescar-Transferencia")?.removeAttribute("disabled"); }
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








  //██████████████████████████████████████████TABLA██████████████████████████████████████████████████████

  public v_Select_Cuenta(event: any, det: iAsientoDetalle): void {
    

    if (event.added.length == 1) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);

      let txtCuenta: IgxComboComponent = event.owner


      let i_Cuenta: iCuenta = this.lstCuenta.find(f => f?.CuentaContable == event.newValue[0])!;


      det.Descripcion = i_Cuenta.NombreCuenta.replaceAll(i_Cuenta.CuentaContable, "");
      det.Naturaleza = i_Cuenta?.Naturaleza;

      document.getElementById("txtReferencia" + det.NoLinea)?.removeAttribute("disabled");
      document.getElementById("txtCentroCosto" + det.NoLinea)?.removeAttribute("disabled");



      if (window.innerWidth <= this.cFunciones.TamanoPantalla("md")) txtCuenta.close();

    }

    this.V_Calcular();


  }

  public v_Enter_Cuenta(event: any, det: iAsientoDetalle) {

    if (event.key == "Enter") {
      let txtCuenta: any = this.cmbCuenta.find(f => f.id == "txtCuenta" + det.NoLinea);
      let cmb: any = txtCuenta.dropdown;

      let _Item: iCuenta = cmb._focusedItem.value;
      if (!txtCuenta.selection.includes(det.CuentaContable[0])) txtCuenta.setSelectedItem(_Item.CuentaContable);
      this.valTabla.Get("txtCuenta" + det.NoLinea).setValue([_Item.CuentaContable]);
      det.Descripcion = _Item.NombreCuenta.replaceAll(_Item.CuentaContable, "");;
      det.Naturaleza = _Item.Naturaleza;

      txtCuenta.close();



    }

  }


  public v_Select_CentroCosto(event: any, det: iAsientoDetalle): void {

    if (event.added.length == 1) {
      let txtCentro: any = this.cmbCombo.find(f => f.id == "txtCentroCosto" + det.NoLinea);

      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      det.CentroCosto = event.newValue[0];

      if (window.innerWidth <= this.cFunciones.TamanoPantalla("md")) txtCentro.close();

    }


  }
  public v_Enter_CentroCosto(event: any, det: iAsientoDetalle) {

    if (event.key == "Enter") {
      let txtCentro: any = this.cmbCombo.find(f => f.id == "txtCentroCosto" + det.NoLinea);

      let cmb: any = txtCentro.dropdown;

      let _Item: iCentroCosto = cmb._focusedItem.value;
      if (!txtCentro.selection.includes(det.CentroCosto)) txtCentro.setSelectedItem(_Item.Codigo);
      this.valTabla.Get("txtCentroCosto" + det.NoLinea).setValue([_Item.Codigo]);
      txtCentro.close();
    }

  }


/*
  public V_FocusOut(det: iAsientoDetalle): void {


    det.Debito = this.cFunciones.NumFormat(Number(det.Debito.replaceAll(",", "")), "2");
    det.DebitoML = this.cFunciones.Redondeo(det.DebitoML, "2");
    det.DebitoMS = this.cFunciones.Redondeo(det.DebitoMS, "2");
    det.Credito = this.cFunciones.NumFormat(Number(det.Credito.replaceAll(",", "")), "2");
    det.CreditoML = this.cFunciones.Redondeo(det.CreditoML, "2");
    det.CreditoMS = this.cFunciones.Redondeo(det.CreditoMS, "2");

  }*/

  public V_Focus(columna: String, det: iAsientoDetalle) {

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

      this.V_Agregar(false);
    }

  }


  
  public V_FocusOut(columna: string, det: iAsientoDetalle) {


    let vacio = ["0.00", "0", ""];
    if (columna == "txtDebito" &&  !vacio.includes(det.Debito) ) {

      if (Number(det.Credito.replaceAll(",", ""))) {
        det.Credito = "0.00";
      }

    }



    if (columna == "txtCredito" &&  !vacio.includes(det.Credito))  {

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


  V_Agregar(esBanco: boolean): number {

    let det: iAsientoDetalle = {} as iAsientoDetalle;
    let i: number = 1;

    if (this.lstDetalle.data.length > 0) i = Math.max(...this.lstDetalle.data.map(o => o.NoLinea)) + 1


    if (esBanco) {

      let x = this.lstDetalle.data.findIndex(f => f.NoLinea == 1);
      i = 1;

      if (x != -1) return i;
    }




    this.valTabla.add("txtCuenta" + i, "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
    this.valTabla.add("txtReferencia" + i, "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
    this.valTabla.add("txtCentroCosto" + i, "1", "LEN>=", "0", "Centro Costo", "Seleccione un centro de costo.");





    det.IdAsiento = -1;
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
    det.NoDocumento = "";
    det.TipoDocumento = "";
    this.lstDetalle.data.push(det);

    this.V_Ordenar(i);


    return i;

  }

  V_Eliminar(item: iAsientoDetalle) {
    console.log(item.NoLinea)

    let i = this.lstDetalle.data.findIndex(f => f.NoLinea == item.NoLinea);

    if (i == -1) return;

    this.lstDetalle.data.splice(i, 1);
    this.V_Ordenar(-1);

    this.valTabla.del("txtCuenta" + item.NoLinea);
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
      document?.getElementById("txtCuenta" + x)?.focus();
      document.getElementById("txtReferencia" + x)?.setAttribute("disabled", "disabled");
      document.getElementById("txtCentroCosto" + x)?.setAttribute("disabled", "disabled");

      let txtCuenta: any = this.cmbCuenta.find(f => f.id == "txtCuenta" + x);
      if (x > 2) txtCuenta.open();

      this.val.addFocus("txtCuenta" + x, "txtReferencia" + x, undefined);
      this.val.addFocus("txtReferencia" + x, "txtCentroCosto" + x, undefined);
      this.val.addFocus("txtCentroCosto" + x, "txtDebito" + x, undefined);
      this.val.addFocus("txtDebito" + x, "txtCredito" + x, undefined);

    }, 250);


  }






  public V_Calcular(): void {

    this.dec_TotalDebe = 0;
    this.dec_TotalHaber = 0;
    this.dec_Dif = 0;

    this.TC = this.cFunciones.Redondeo(Number(String(this.val.Get("TxtTC").value).replaceAll(",", "")), "4");
    this.val.Get("TxtTC").setValue(this.TC);


    this.lstDetalle.data.forEach(f => {

      let Debe = Number(String(f.Debito).replaceAll(",", ""));
      let Haber = Number(String(f.Credito).replaceAll(",", ""));

      // if (this.IdMoneda == "COR") {
      f.DebitoML = this.cFunciones.Redondeo(Debe, "2");
      f.DebitoMS = this.cFunciones.Redondeo(f.DebitoML / this.TC, "2");

      f.CreditoML = this.cFunciones.Redondeo(Haber, "2");
      f.CreditoMS = this.cFunciones.Redondeo(f.CreditoML / this.TC, "2");

      // }
      // else {
      //   f.DebitoMS = this.cFunciones.Redondeo(Debe, "2");
      //  f.DebitoML = this.cFunciones.Redondeo(f.DebitoMS * this.TC, "2");

      //   f.CreditoMS = this.cFunciones.Redondeo(Haber, "2");
      //   f.CreditoML = this.cFunciones.Redondeo(f.CreditoMS * this.TC, "2");

      //  }

      this.dec_TotalDebe += Debe;
      this.dec_TotalHaber += Haber;
    });

    this.dec_Dif = this.cFunciones.Redondeo(this.dec_TotalDebe - this.dec_TotalHaber, "2");

    let TotalCordoba: number = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoML), 0);
    let TotalDolar: number = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoMS), 0);


    this.val.Get("txtTotalCordoba").setValue(this.cFunciones.NumFormat(TotalCordoba, "2"));
    this.val.Get("txtTotalDolar").setValue(this.cFunciones.NumFormat(TotalDolar, "2"));


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
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: "<span>Tiene una diferencia de: <b>" + this.cFunciones.NumFormat(this.dec_Dif, "2") + "</b></span>",
      });

      return;
    }

    this.FILA.IdCuentaBanco = this.val.Get("cmbCuentaBancaria").value[0];
    this.FILA.IdMoneda = this.IdMoneda;
    this.FILA.CodBodega = this.val.Get("cmbBodega").value[0];
    this.FILA.IdSerie = "TBan"
    this.FILA.NoTransferencia = this.val.Get("txtNoDoc").value;
    this.FILA.Fecha = this.val.Get("txtFecha").value;
    this.FILA.Beneficiario = this.val.Get("txtBeneficiario").value;
    this.FILA.TasaCambio = this.val.Get("TxtTC").value;
    this.FILA.Concepto = this.val.Get("txtConcepto").value;
    this.FILA.Comision = 0;
    this.FILA.ComisionCordoba = 0;
    this.FILA.ComisionDolar = 0;
    this.FILA.Total = this.lstDetalle.data.reduce((acc, cur) => acc + Number(String(cur.Credito).replaceAll(",", "")), 0);
    this.FILA.TotalCordoba = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoML), 0);
    this.FILA.TotalDolar = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoMS), 0);
    this.FILA.UsuarioReg = this.cFunciones.User;
    if (!this.esModal) this.FILA.Anulado = false;
    this.FILA.TipoTransferencia = "C";



    let Asiento: iAsiento = {} as iAsiento;
    let CuentaBancaria = this.lstCuentabancaria.find(f => f.IdCuentaBanco == this.FILA.IdCuentaBanco);


    Asiento.NoDocOrigen = this.FILA.NoTransferencia;
    Asiento.IdSerieDocOrigen = this.FILA.IdSerie;
    Asiento.TipoDocOrigen = "TRANSFERENCIA A CUENTA";

    Asiento.IdSerie = Asiento.IdSerieDocOrigen;
    Asiento.Bodega = this.FILA.CodBodega;
    Asiento.Fecha = this.FILA.Fecha;
    Asiento.Referencia = this.FILA.Beneficiario;
    Asiento.Concepto = this.FILA.Concepto;
    Asiento.IdMoneda = String(CuentaBancaria?.IdMoneda);
    Asiento.TasaCambio = this.val.Get("TxtTC").value;
    Asiento.AsientosContablesDetalle = JSON.parse(JSON.stringify(this.lstDetalle.data));
    Asiento.Total = this.FILA.Total;
    Asiento.TotalML = this.FILA.TotalCordoba;
    Asiento.TotalMS = this.FILA.TotalDolar;
    Asiento.UsuarioReg = this.FILA.UsuarioReg;
    Asiento.FechaReg = new Date();
    Asiento.Estado = "";

    Asiento.AsientosContablesDetalle.forEach(f => {
      f.CuentaContable = f.CuentaContable[0];
      if (f.CentroCosto != undefined) f.CentroCosto = f.CentroCosto[0];
    });


    Asiento.IdPeriodo = 0;
    Asiento.Estado = "AUTORIZADO";
    Asiento.TipoAsiento = "ASIENTO BASE";
    Asiento.NoAsiento = "";


    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    document.getElementById("btnGuardar-Transferencia-Cuenta")?.setAttribute("disabled", "disabled");


    let Datos: iTransferenciaPOST = {} as iTransferenciaPOST;
    Datos.T = this.FILA;
    Datos.A = Asiento;

    this.POST.GuardarTransferencia(Datos).subscribe(
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
            let msj: string = Datos[0].d;

            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              data: "<p><b class='bold'>" + msj + "</b></p>"
            });


            if (!this.esModal) this.v_Evento("Limpiar");

          }

        },
        error: (err) => {
          dialogRef.close();

          document.getElementById("btnGuardar-Transferencia-Cuenta")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          document.getElementById("btnGuardar-Transferencia-Cuenta")?.removeAttribute("disabled");
        }
      }
    );


  }


  private v_Visualizar() {


    this.cmbCuentaBancaria.setSelectedItem(this.FILA.IdCuentaBanco);
    this.cmbBodega.setSelectedItem(this.FILA.CodBodega);
    this.val.Get("txtNoDoc").setValue(this.FILA.NoTransferencia);
    this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.FILA.Fecha, "yyyy-MM-dd"));
    this.val.Get("txtBeneficiario").setValue(this.FILA.Beneficiario);
    this.val.Get("TxtTC").setValue(this.FILA.TasaCambio);
    this.val.Get("txtConcepto").setValue(this.FILA.Concepto);
    this.val.Get("txtTotalDolar").setValue(this.cFunciones.NumFormat(this.FILA.TotalDolar, "2"));
    this.val.Get("txtTotalCordoba").setValue(this.cFunciones.NumFormat(this.FILA.TotalCordoba, "2"));
    this.IdMoneda = this.FILA.IdMoneda;

    this.TC = this.FILA.TasaCambio;
    this.Anulado = this.FILA.Anulado;





    setTimeout(() => {

      this.lstDetalle.data.forEach(f => {
        this.valTabla.add("txtCuenta" + f.NoLinea, "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
        this.valTabla.add("txtReferencia" + f.NoLinea, "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
        this.valTabla.add("txtCentroCosto" + f.NoLinea, "1", "LEN>", "0", "Centro Costo", "Seleccione un centro de costo.");

        f.Debito = this.cFunciones.NumFormat(Number(String(f.Debito).replaceAll(",", "")), "2");
        f.Credito = this.cFunciones.NumFormat(Number(String(f.Credito).replaceAll(",", "")), "2");

        let txtCuenta: any = this.cmbCuenta.find(y => y.id == "txtCuenta" + f.NoLinea);
        txtCuenta.select([f.CuentaContable]);


       // if (!txtCuenta.selection[0]?.CuentaContable.includes(f.CuentaContable[0])) txtCuenta.setSelectedItem(f.CuentaContable);




        this.valTabla.Get("txtCuenta" + f.NoLinea).setValue(f.CuentaContable);
        this.valTabla.Get("txtReferencia" + f.NoLinea).setValue(f.Referencia);
       


        let txtCentro: any = this.cmbCombo.find(y => y.id == "txtCentroCosto" + f.NoLinea);
        //if (!txtCentro.selection[0]?.Codigo.includes(f.CentroCosto[0]) && f.CentroCosto != undefined) txtCentro.setSelectedItem(f.CentroCosto);
        txtCentro.select([f.CentroCosto]);


        document.getElementById("txtCentroCosto" + f.NoLinea)?.setAttribute("disabled", "disabled");




      });



      let dialogRef: any = this.cFunciones.DIALOG.getDialogById("wait");
      if (dialogRef != undefined) dialogRef.close();


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





  ngDoCheck() {


    ///CAMBIO DE FOCO
    this.val.Combo(this.cmbCombo);
    this.val.addFocus("cmbCuentaBancaria", "cmbBodega", undefined);
    this.val.addFocus("cmbBodega", "txtBeneficiario", undefined);
    this.val.addFocus("txtFecha", "txtBeneficiario", undefined);
    this.val.addFocus("txtBeneficiario", "txtConcepto", undefined);
    this.val.addNumberFocus("TxtTC", 4);



    if (this.cmbCuentaBancaria != undefined) this.cmbCuentaBancaria.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbBodega != undefined) this.cmbBodega.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";




    this.lstDetalle.data.forEach(f => {


      if (this.cmbCuenta != undefined) {
        let txtCuenta: any = this.cmbCuenta.find(y => y.id == "txtCuenta" + f.NoLinea);
        if (txtCuenta != undefined) txtCuenta.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";

        if(f.NoLinea == 1)
        {

          let cBanco : any = this.lstCuentabancaria.find(w => w.IdCuentaBanco == this.cmbCuentaBancaria?.value[0]);

          txtCuenta.setSelectedItem(cBanco?.IdMoneda == this.cFunciones.MonedaLocal? cBanco?.CuentaNuevaC : cBanco?.CuentaNuevaD);

          document.getElementById("txtCuenta" + f.NoLinea)?.setAttribute("disabled", "disabled");


        }

        let txtCentroCosto: any = this.cmbCuenta.find(y => y.id == "txtCentroCosto" + f.NoLinea);
        if (txtCentroCosto != undefined) txtCentroCosto.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";

      }




      this.valTabla.addFocus("txtCuenta" + f.NoLinea, "txtReferencia" + f.NoLinea, undefined);
      this.valTabla.addFocus("txtReferencia" + f.NoLinea, "txtCentroCosto" + f.NoLinea, undefined);


      this.valTabla.addNumberFocus("txtDebito" + f.NoLinea, 2);
      this.valTabla.addNumberFocus("txtCredito" + f.NoLinea, 2);


    });


  }

  ngAfterViewInit(): void {

    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";
     
   
  }


}
