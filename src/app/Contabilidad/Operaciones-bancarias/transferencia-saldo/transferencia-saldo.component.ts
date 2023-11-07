import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings, scaleInCenter, scaleOutCenter } from 'igniteui-angular';
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
import { iTransferenciaCuentaPOST } from 'src/app/Interface/Contabilidad/I-transferencia-cuenta-POST';
import { iProveedor } from 'src/app/Interface/Proveedor/i-proveedor';
import { iTransferenciaDocumento } from 'src/app/Interface/Contabilidad/i-Transferencia-Documento';
import { iTransferenciaCuenta } from 'src/app/Interface/Contabilidad/i-Transferencia-cuenta';
import { iCuenta } from 'src/app/Interface/Contabilidad/i-Cuenta';
import { AsientoContableComponent } from '../../asiento-contable/nuevo-asiento-contable/asiento-contable/asiento-contable.component';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';

@Component({
  selector: 'app-transferencia-saldo',
  templateUrl: './transferencia-saldo.component.html',
  styleUrls: ['./transferencia-saldo.component.scss']
})
export class TransferenciaSaldoComponent {
  public overlaySettings: OverlaySettings = {};
  public val = new Validacion();
  public valTabla = new Validacion();

  private IdMoneda: string = "";

  lstProveedor: iProveedor[] = [];
  lstCuenta: iCuenta[] = [];
  public lstCuentabancaria: iCuentaBancaria[] = [];
  lstBodega: iBodega[] = [];


  @ViewChildren(IgxComboComponent)
  public cmbCuenta: QueryList<IgxComboComponent>;

  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iTransferenciaDocumento>;
  private lstDetalleAsiento: iAsientoDetalle[] = [];


  public FILA: iTransferenciaCuenta = {} as iTransferenciaCuenta;
  public Asiento: iAsiento = {} as iAsiento;


  public esModal: boolean = false;
  public TC: number;
  public Anulado: boolean = false;
  public dec_Disponible: number = 0;
  public dec_Aplicado: number = 0;
  public dec_Dif: number = 0;


  @ViewChildren(IgxComboComponent)
  public cmbCombo: QueryList<IgxComboComponent>;


  constructor(public cFunciones: Funciones, private GET: getTransferencia, private POST: postTrasnferencia) {

    this.val.add("cmbCuentaBancaria", "1", "LEN>", "0", "No Cuenta", "Seleccione una cuenta bancaria.");
    this.val.add("txtNombreCuenta", "1", "LEN>", "0", "Nombre Cuenta", "No se ha definido el nombre de la cuenta.");
    this.val.add("txtBanco", "1", "LEN>", "0", "Banco", "No se ha definido el banco.");
    this.val.add("cmbBodega", "1", "LEN>", "0", "Sucursal", "Seleccione una sucursal.");
    this.val.add("txtNoDoc", "1", "LEN>", "0", "No Doc", "No se ha definido el número de consecutivo.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Ingrese una fecha valida.");
    this.val.add("cmbProveedor", "1", "LEN>", "0", "Proveedor", "Seleccione un proveedor.");
    this.val.add("txtMoneda", "1", "LEN>", "0", "Moneda", "No se ha especificado la moneda de la cuenta.");
    this.val.add("TxtTC", "1", "NUM>", "0", "Tasa Cambio", "No se ha configurado el tipo de cambio.");
    this.val.add("txtComision", "1", "NUM>=", "0", "Banco", "Revisar la comisión bancaria.");
    this.val.add("txtConcepto", "1", "LEN>", "0", "Concepto", "Ingrese un concepto.");
    this.val.add("txtTotalCordoba", "1", "LEN>=", "0", "Total Cordoba", "");
    this.val.add("txtTotalDolar", "1", "LEN>=", "0", "Total Dolar", "");

    this.valTabla.IsTable = true;

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
        this.dec_Disponible = 0;
        this.dec_Aplicado = 0;
        this.dec_Dif = 0;

        this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
        this.lstDetalle = new MatTableDataSource<iTransferenciaDocumento>;





        this.val.Get("cmbCuentaBancaria").setValue("");
        this.val.Get("txtNombreCuenta").setValue("");
        this.val.Get("txtBanco").setValue("");
        this.val.Get("cmbBodega").setValue("");
        this.val.Get("txtNoDoc").setValue("");
        this.val.Get("txtFecha").setValue(this.cFunciones.ShortFechaServidor());
        this.val.Get("cmbProveedor").setValue("");
        this.val.Get("txtMoneda").setValue("");
        this.val.Get("txtConcepto").setValue("");
        this.val.Get("txtTotalDolar").setValue("0.00");
        this.val.Get("txtTotalCordoba").setValue("0.00");
        this.val.Get("txtComision").setValue("0.00");


        this.val.Get("txtNombreCuenta").disable();
        this.val.Get("txtBanco").disable();
        this.val.Get("txtNoDoc").disable();
        this.val.Get("txtMoneda").disable();
        this.val.Get("TxtTC").disable();
        this.val.Get("txtTotalDolar").disable();
        this.val.Get("txtTotalCordoba").disable();
        this.val.Get("txtComision").disable();


        if (this.lstBodega.length > 0) this.cmbBodega?.setSelectedItem(this.lstBodega[0].Codigo);


        this.V_TasaCambios();



        break;
    }
  }



  @ViewChild("cmbCuentaBancaria", { static: false })
  public cmbCuentaBancaria: IgxComboComponent;

  public v_Select_CuentaBanco(event: any) {

    this.val.Get("txtTotalDolar").disable();
    this.val.Get("txtTotalCordoba").disable();
    this.val.Get("txtComision").disable();


    this.val.Get("cmbCuentaBancaria").setValue("");
    if (event.added.length == 1) {
      if (event.oldSelection[0] != event.added[0]) event.newSelection = event.added;
      let _Item = this.lstCuentabancaria.find(f => f.IdCuentaBanco == event.added);

      this.val.Get("cmbCuentaBancaria").setValue([event.added]);
      this.val.Get("txtNombreCuenta").setValue(_Item?.NombreCuenta);
      this.val.Get("txtBanco").setValue(_Item?.Banco);
      this.val.Get("txtMoneda").setValue(_Item?.Moneda);
      this.val.Get("txtNoDoc").setValue(_Item?.Consecutivo);


      if (this.IdMoneda != _Item?.IdMoneda) {
        this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
        this.lstDetalle.filter = "";
      }



      this.IdMoneda = String(_Item?.IdMoneda);


    }

    this.V_Calcular();
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
      if (event.oldSelection[0] != event.added[0]) event.newSelection = event.added;
      this.val.Get("cmbBodega").setValue([event.added]);
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






  @ViewChild("cmbProveedor", { static: false })
  public cmbProveedor: IgxComboComponent;

  public v_Select_Proveedor(event: any) {

    this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
    this.lstDetalle.filter = "";

    if (event.added.length == 1) {
      if (event.oldSelection[0] != event.added[0]) event.newSelection = event.added;
      let _Item = this.lstProveedor.find(f => f.Codigo == event.added);

      this.val.Get("cmbProveedor").setValue([event.added]);


    }
  }

  public v_Enter_Proveedor(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbProveedor.dropdown;
      let _Item: iProveedor = cmb._focusedItem.value;
      this.cmbProveedor.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbProveedor").setValue([_Item.Codigo]);
    }
  }




  public v_FocusOut(id: string): void {
    this.val.Get(id).setValue(this.cFunciones.NumFormat(this.val.Get(id).value.replaceAll(",", ""), "2"));
  }




  public v_ConvertirTotal(event: any): void {

    let valor: number = 0;
    let id: String = "";

    if (event != "") {
      if (event.target.value == "") return;
      valor = Number(String(event.target.value).replaceAll(",", ""));

      id = event.target.id;
    }
    else {
      valor = Number(String(this.val.Get("txtTotalDolar").value).replaceAll(",", ""));
      id = "txtTotalDolar";
      if (this.IdMoneda == this.cFunciones.MonedaLocal) {
        valor = Number(String(this.val.Get("txtTotalCordoba").value).replaceAll(",", ""));
        id = "txtTotalCordoba";
      }

    }



    if (id == "txtTotalCordoba") {
      valor = valor / this.TC;
      this.val.Get("txtTotalDolar").setValue(this.cFunciones.NumFormat(valor, "2"));
    }

    if (id == "txtTotalDolar") {
      valor = valor * this.TC;
      this.val.Get("txtTotalCordoba").setValue(this.cFunciones.NumFormat(valor, "2"));
    }

    this.V_Calcular();

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
            this.lstCuenta = datos[2].d;
            this.lstProveedor = datos[3].d;


            if (this.cmbBodega.selection.length == 0) this.cmbBodega.setSelectedItem(this.lstBodega[0]?.Codigo);


            if (this.cmbBodega.selection.length != 0) {
              let i_C = this.lstCuentabancaria.find(f => f.IdCuentaBanco == this.val.Get("cmbCuentaBancaria").value[0])
              this.val.Get("txtNombreCuenta").setValue(i_C?.NombreCuenta);
              this.val.Get("txtBanco").setValue(i_C?.Banco);
              this.val.Get("txtMoneda").setValue(i_C?.Moneda);
              this.val.Get("txtNoDoc").setValue(i_C?.Consecutivo);
              this.IdMoneda = String(i_C?.IdMoneda);
              this.V_Calcular();
              this.V_Contabilizacion();
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
            this.v_ConvertirTotal("");
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






  public v_BuscarDocumentos(): void {

    if (this.esModal) return;


    this.val.ItemValido(["cmbProveedor", "TxtTC"]);

    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }



    this.lstDetalle.data.splice(0, this.lstDetalle.data.length);

    document.getElementById("btn-Documentos-proveedor")?.setAttribute("disabled", "disabled");


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




    this.GET.GetDocumentos(this.val.Get("cmbProveedor").value).subscribe(
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

            let datos: iDatos = _json["d"];


            this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
            this.lstDetalle.data = datos.d;

      
            this.lstDetalle.data.forEach(f => {

              let saldo: number = 0
              let saldoDolar: number = 0
              let saldoCordoba: number = 0

              f.SaldoAnt = (f.IdMoneda == this.cFunciones.MonedaLocal ? f.SaldoCordoba : f.SaldoDolar);
              f.SaldoAntML = f.SaldoCordoba;
              f.SaldoAntMS = f.SaldoDolar;


              if (this.IdMoneda == this.cFunciones.MonedaLocal) {


                saldo = f.SaldoCordoba;
                saldoCordoba = saldo;
                saldoDolar = this.cFunciones.Redondeo(saldoCordoba / this.TC, "2");


                if (f.IdMoneda != this.cFunciones.MonedaLocal) {
                  saldo = f.SaldoDolar;
                  saldoDolar = saldo;
                  saldoCordoba = this.cFunciones.Redondeo(saldoDolar * this.TC, "2");

                }

                saldo = this.cFunciones.Redondeo(saldoCordoba, "2");

              }

              else {

                saldo = f.SaldoDolar;
                saldoDolar = saldo;
                saldoCordoba = this.cFunciones.Redondeo(saldo * this.TC, "2");

                if (f.IdMoneda == this.cFunciones.MonedaLocal) {
                  saldo = f.SaldoCordoba;
                  saldoCordoba = saldo;
                  saldoDolar = this.cFunciones.Redondeo(saldoCordoba / this.TC, "2");
                }

                saldo = this.cFunciones.Redondeo(saldoDolar, "2");
              }

              f.Importe = "0.00";
              f.Saldo = this.cFunciones.NumFormat(saldo, "2");
              f.SaldoCordoba = this.cFunciones.Redondeo(saldoCordoba, "2");
              f.SaldoDolar = this.cFunciones.Redondeo(saldoDolar, "2");

            });

            this.V_Calcular();

          }

        },
        error: (err) => {


          dialogRef.close();

          document.getElementById("btn-Documentos-proveedor")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => { document.getElementById("btn-Documentos-proveedor")?.removeAttribute("disabled"); }
      }
    );


  }






  public V_Calcular(): void {

    if (this.IdMoneda != "undefined" && this.IdMoneda != "") {

      this.val.Get("txtComision").enable();

      if (this.IdMoneda == this.cFunciones.MonedaLocal) {
        this.val.Get("txtTotalCordoba").enable();
        this.dec_Disponible = Number(this.val.Get("txtTotalCordoba").value.toString().replaceAll(",", ""));
      }
      else {
        this.val.Get("txtTotalDolar").enable();
        this.dec_Disponible = Number(this.val.Get("txtTotalDolar").value.toString().replaceAll(",", ""));
      }
    }




    this.dec_Aplicado = 0;
    this.dec_Dif = 0;

    this.lstDetalle.data.forEach(f => {

      f.Operacion = "";

      let Importe: number = this.cFunciones.Redondeo(Number(String(f.Importe).replaceAll(",", "")), "2");
      let Saldo: number = Number(String(f.Saldo).replaceAll(",", ""));


      let NuevoSaldo: number = Saldo;

      if (Importe < 0) Importe = 0;
      if (Importe > 0) {
        NuevoSaldo = this.cFunciones.Redondeo(Saldo - Importe, "2");
        f.Operacion = "Abono";
      }

      if (NuevoSaldo < 0) {
        NuevoSaldo = 0;
        Importe = Saldo;
      }

      if (NuevoSaldo == 0) f.Operacion = "Cancelación";


      f.Importe = this.cFunciones.NumFormat(Importe, "2");
      f.NuevoSaldo = this.cFunciones.NumFormat(NuevoSaldo, "2");
      f.NuevoSaldoML = 0;
      f.NuevoSaldoMS = 0;
      this.dec_Aplicado += Importe;


      if (this.cFunciones.MonedaLocal == this.IdMoneda) {
        f.ImporteML = this.cFunciones.Redondeo(Importe, "2");
        f.ImporteMS = this.cFunciones.Redondeo(f.ImporteML / this.TC, "2");
      }
      else {
        f.ImporteMS = this.cFunciones.Redondeo(Importe, "2");
        f.ImporteML = this.cFunciones.Redondeo(f.ImporteMS * this.TC, "2");
      }


      //DIFERENCIAL CAMBIARIO (ANTERIOR - ACTUAL)


      if (f.IdMoneda == this.cFunciones.MonedaLocal) {
        f.DiferencialMS = this.cFunciones.Redondeo(Importe / f.TasaCambioDoc, "2") - f.ImporteMS;
        f.DiferencialMS = this.cFunciones.Redondeo(f.DiferencialMS, "2");
        f.DiferencialML = 0;

        if (this.IdMoneda != this.cFunciones.MonedaLocal) {
          f.DiferencialMS = this.cFunciones.Redondeo(f.ImporteML / f.TasaCambioDoc, "2") - f.ImporteMS;
          f.DiferencialMS = this.cFunciones.Redondeo(f.DiferencialMS, "2");
        }

      }
      else {

        f.DiferencialML = this.cFunciones.Redondeo(Importe * f.TasaCambioDoc, "2") - f.ImporteML;
        f.DiferencialML = this.cFunciones.Redondeo(f.DiferencialML, "2");
        f.DiferencialMS = 0;

        if (this.IdMoneda == this.cFunciones.MonedaLocal) {
          f.DiferencialML = this.cFunciones.Redondeo(f.ImporteMS * f.TasaCambioDoc, "2") - f.ImporteML;
          f.DiferencialML = this.cFunciones.Redondeo(f.DiferencialML, "2");
        }

      }

      f.NuevoSaldoML = this.cFunciones.Redondeo((f.SaldoAntML - f.ImporteML), "2") - f.DiferencialML;
      f.NuevoSaldoMS = this.cFunciones.Redondeo((f.SaldoAntMS - f.ImporteMS), "2") - f.DiferencialMS;





      if (NuevoSaldo == 0) {


        if (f.NuevoSaldoMS != 0) f.DiferencialMS += f.NuevoSaldoMS;
        if (f.NuevoSaldoML != 0) f.DiferencialML += f.NuevoSaldoML;

        /*if (f.IdMoneda == this.cFunciones.MonedaLocal) {
          f.NuevoSaldoML = 0;

          if (f.NuevoSaldoMS != 0) f.DiferencialMS += f.NuevoSaldoMS;

        }
        else {
          f.NuevoSaldoMS = 0;

          if (f.NuevoSaldoML != 0) f.DiferencialML += f.NuevoSaldoML;
        }*/
      }


      f.NuevoSaldoML = this.cFunciones.Redondeo((f.SaldoAntML - f.ImporteML), "2") - f.DiferencialML;
      f.NuevoSaldoMS = this.cFunciones.Redondeo((f.SaldoAntMS - f.ImporteMS), "2") - f.DiferencialMS;



      if (this.cFunciones.MonedaLocal == this.IdMoneda) {
        f.NuevoSaldoML = this.cFunciones.Redondeo(NuevoSaldo, "2");
        f.NuevoSaldoMS = this.cFunciones.Redondeo(f.NuevoSaldoML / this.TC, "2");
      }
      else {
        f.NuevoSaldoMS = this.cFunciones.Redondeo(NuevoSaldo, "2");
        f.NuevoSaldoML = this.cFunciones.Redondeo(f.NuevoSaldoMS * this.TC, "2");
      }


    });



    this.dec_Dif = this.cFunciones.Redondeo(this.dec_Disponible - this.dec_Aplicado, "2");


  }


  public V_Mostrar_Asiento() {
    this.V_Contabilizacion();

    let Asiento: iAsiento = JSON.parse(JSON.stringify(this.Asiento));


    let dialogRef: MatDialogRef<DialogoConfirmarComponent> = this.cFunciones.DIALOG.open(
      DialogoConfirmarComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true
      }
    );


    dialogRef.afterOpened().subscribe(s => {
      dialogRef.componentInstance.textBoton1 = "Cordobas";
      dialogRef.componentInstance.textBoton2 = "Dolares";
      dialogRef.componentInstance.mensaje = "<p><b>Contabilización</b></p>";
    });


    dialogRef.afterClosed().subscribe(s => {


      if (dialogRef.componentInstance.retorno == "1") {
        Asiento.AsientosContablesDetalle = JSON.parse(JSON.stringify(Asiento.AsientosContablesDetalle.filter(f => (Math.abs(f.DebitoML) + Math.abs(f.CreditoML)) != 0)));

      }
      else {
        Asiento.AsientosContablesDetalle = JSON.parse(JSON.stringify(Asiento.AsientosContablesDetalle.filter(f => (Math.abs(f.DebitoMS) + Math.abs(f.CreditoMS)) != 0)));

      }

      let i: number = 1;

      Asiento.AsientosContablesDetalle.forEach(f => {

        f.NoLinea = i;

        if (dialogRef.componentInstance.retorno == "1") {
          f.Debito = String(f.DebitoML);
          f.Credito = String(f.CreditoML);
        }
        else {
          f.Debito = String(f.DebitoMS);
          f.Credito = String(f.CreditoMS);
        }

        i++;

      });







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
        dialogAsiento.componentInstance.esAuxiliar = false;

      });

    });





  }

  private V_Contabilizacion(): void {
    this.lstDetalleAsiento.splice(0, this.lstDetalleAsiento.length);



    let i_Prov: iProveedor = this.lstProveedor.find(f => f.Codigo == this.val.Get("cmbProveedor").value[0])!;
    let i_Banco: any = this.lstCuentabancaria.find(f => f.IdCuentaBanco == this.val.Get("cmbCuentaBancaria").value[0])!;

    let TotalBanco: number = (this.IdMoneda == this.cFunciones.MonedaLocal ? Number(this.val.Get("txtTotalCordoba").value.replaceAll(",", "")) : Number(this.val.Get("txtTotalDolar").value.replaceAll(",", "")));
    let Comision: number = Number(this.val.Get("txtComision").value.replaceAll(",", ""));


    if(i_Banco == undefined) return;



    this.Asiento.NoDocOrigen = this.val.Get("txtNoDoc").value;
    this.Asiento.IdSerieDocOrigen = i_Banco.IdSerie;
    this.Asiento.TipoDocOrigen = "TRANSFERENCIA A DOCUMENTO";

    this.Asiento.IdSerie = this.Asiento.IdSerieDocOrigen;
    this.Asiento.Bodega = this.val.Get("cmbBodega").value[0];
    this.Asiento.Fecha = this.val.Get("txtFecha").value;
    this.Asiento.Referencia = i_Banco.CuentaBancaria;
    this.Asiento.Concepto = this.val.Get("txtConcepto").value;
    this.Asiento.IdMoneda = this.IdMoneda;
    this.Asiento.TasaCambio = this.TC;

    this.Asiento.Total = this.FILA.Total;
    this.Asiento.TotalML = this.FILA.TotalCordoba;
    this.Asiento.TotalMS = this.FILA.TotalDolar;
    this.Asiento.UsuarioReg = this.FILA.UsuarioReg;
    this.Asiento.FechaReg = new Date();
    this.Asiento.Estado = "";

    this.Asiento.IdPeriodo = 0;
    this.Asiento.Estado = "Autorizado";
    this.Asiento.TipoAsiento = "ASIENTO BASE";
    this.Asiento.NoAsiento = "";



    this.Nueva_Linea_Asiento(TotalBanco, (this.IdMoneda == this.cFunciones.MonedaLocal ? i_Banco.CuentaC : i_Banco.CuentaD), i_Banco.CuentaBancaria, "C", "");
    this.Nueva_Linea_Asiento(Comision, (this.IdMoneda == this.cFunciones.MonedaLocal ? i_Banco.CuentaC : i_Banco.CuentaD), i_Banco.CuentaBancaria, "C", "");


    this.lstDetalle.data.filter(f => Number(f.Importe.replaceAll(",", "")) > 0).forEach(f => {


      if (this.IdMoneda == this.cFunciones.MonedaLocal) {
        this.Nueva_Linea_Asiento(Number(f.Importe.replaceAll(",", "")), i_Prov.CUENTAXPAGAR, f.Documento, "D", "");
      }
      else {
        this.Nueva_Linea_Asiento(Number(f.Importe.replaceAll(",", "")), i_Prov.CUENTAXPAGAR, f.Documento, "D", "");

      }


      if (f.DiferencialML != 0) this.Nueva_Linea_Asiento(Math.abs(f.DiferencialML), i_Prov.CUENTAXPAGAR, "DIFERENCIAL Doc:" + f.Documento, "D", "ML");
      if (f.DiferencialMS != 0) this.Nueva_Linea_Asiento(Math.abs(f.DiferencialMS), i_Prov.CUENTAXPAGAR, "DIFERENCIAL Doc:" + f.Documento, "D", "MS");

      if (f.DiferencialML != 0) this.Nueva_Linea_Asiento(Math.abs(f.DiferencialML), "1113-04-01", "DIFERENCIAL Doc:" + f.Documento, "C", "ML");
      if (f.DiferencialMS != 0) this.Nueva_Linea_Asiento(Math.abs(f.DiferencialMS), "1113-04-01", "DIFERENCIAL Doc:" + f.Documento, "C", "MS");

    });


    this.Asiento.AsientosContablesDetalle = JSON.parse(JSON.stringify(this.lstDetalleAsiento));

  }

  private Nueva_Linea_Asiento(Monto: number, Cuenta: string, Referencia: string, Naturaleza: string, Columna: string): void {

    if (Monto == 0) return;
    Monto = this.cFunciones.Redondeo(Monto, "2");


    let i: number = 1;
    let det: iAsientoDetalle = {} as iAsientoDetalle;
    let i_Cuenta = this.lstCuenta.find(f => f.CuentaContable == Cuenta);

    if (this.lstDetalleAsiento.length > 0) i = Math.max(...this.lstDetalleAsiento.map(o => o.NoLinea)) + 1


    det.IdAsiento = -1;
    det.NoLinea = i;
    det.CuentaContable = Cuenta;
    det.Modulo = "CON";
    det.Descripcion = i_Cuenta?.NombreCuenta!;
    det.Referencia = Referencia;



    if (Naturaleza == "D") {

      switch (Columna) {
        case "ML":
          det.Debito = String(Monto);
          det.DebitoML = Monto;
          det.DebitoMS = 0;
          break;
        case "MS":
          det.Debito = String(Monto);
          det.DebitoMS = Monto;
          det.DebitoML = 0;
          break;
        default:

          if (this.cFunciones.MonedaLocal == this.IdMoneda) {
            det.Debito = String(Monto);
            det.DebitoML = Monto;
            det.DebitoMS = this.cFunciones.Redondeo(Monto / this.TC, "2");
          }
          else {
            det.Debito = String(Monto);
            det.DebitoMS = Monto;
            det.DebitoML = this.cFunciones.Redondeo(Monto * this.TC, "2");
          }


          break;

      }


      det.Credito = "0";
      det.CreditoML = 0;
      det.CreditoMS = 0;

    }
    else {
      switch (Columna) {
        case "ML":
          det.Credito = String(Monto);
          det.CreditoML = Monto;
          det.CreditoMS = 0;
          break;
        case "MS":
          det.Credito = String(Monto);
          det.CreditoMS = Monto;
          det.CreditoML = 0;
          break;
        default:

          if (this.cFunciones.MonedaLocal == this.IdMoneda) {
            det.Credito = String(Monto);
            det.CreditoML = Monto;
            det.CreditoMS = this.cFunciones.Redondeo(Monto / this.TC, "2");
          }
          else {
            det.Credito = String(Monto);
            det.CreditoMS = Monto;
            det.CreditoML = this.cFunciones.Redondeo(Monto * this.TC, "2");
          }


          break;

      }


      det.Debito = "0";
      det.DebitoML = 0;
      det.DebitoMS = 0;
    }




    this.lstDetalleAsiento.push(det);

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
    this.FILA.CodBodega = this.val.Get("cmbBodega").value[0];
    this.FILA.IdSerie = "TBan"
    this.FILA.NoTransferencia = this.val.Get("txtNoDoc").value;
    this.FILA.Fecha = this.val.Get("txtFecha").value;
    this.FILA.Beneficiario = this.val.Get("txtBeneficiario").value;
    this.FILA.TasaCambio = this.val.Get("TxtTC").value;
    this.FILA.Concepto = this.val.Get("txtConcepto").value;
    //this.FILA.Total = this.lstDetalle.data.reduce((acc, cur) => acc + Number(String(cur.Credito).replaceAll(",", "")), 0);
    //this.FILA.TotalCordoba = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoML), 0);
    // this.FILA.TotalDolar = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoMS), 0);
    this.FILA.UsuarioReg = this.cFunciones.User;
    if (!this.esModal) this.FILA.Anulado = false;
    this.FILA.TipoTransferencia = "C";



    this.V_Contabilizacion();





    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    document.getElementById("btnGuardar-Asiento")?.setAttribute("disabled", "disabled");


    let Datos: iTransferenciaCuentaPOST = {} as iTransferenciaCuentaPOST;
    Datos.T = this.FILA;
    Datos.A = this.Asiento;

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

    this.TC = this.FILA.TasaCambio;
    this.Anulado = this.FILA.Anulado;





    let dialogRef: any = this.cFunciones.DIALOG.getDialogById("wait");
    if (dialogRef != undefined) dialogRef.close();

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
    this.val.Combo(this.cmbCombo);
    this.val.addFocus("cmbCuentaBancaria", "cmbBodega", undefined);
    this.val.addFocus("cmbBodega", "cmbProveedor", undefined);
    this.val.addFocus("cmbProveedor", "txtConcepto", undefined);

   
   
  }

  ngDoCheck(){

    this.val.addNumberFocus("TxtTC", 2);
    this.val.addNumberFocus("txtComision", 2);
    this.val.addNumberFocus("txtTotalCordoba", 2);
    this.val.addNumberFocus("txtTotalDolar", 2);


    this.lstDetalle.data.forEach(f => {
      this.val.addNumberFocus("txtImporte" + f.Index, 2);
      this.val.addFocus("txtImporte" + f.Index, "txtImporte" + (f.Index + 1) , undefined);
    });

      
  }
}
