import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { iCuentaBancaria } from 'src/app/Interface/Contabilidad/i-Cuenta-Bancaria';
import { iBodega } from 'src/app/Interface/Inventario/i-Bodega';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { getCheques } from '../CRUD/GET/get-Cheques';
import { iAsientoDetalle } from 'src/app/Interface/Contabilidad/i-Asiento-Detalle';
import { iAsiento } from 'src/app/Interface/Contabilidad/i-Asiento';
import { postCheque } from '../CRUD/POST/post-Cheque';
import { iProveedor } from 'src/app/Interface/Proveedor/i-proveedor';
import { iChequeDocumento } from '../../../Interface/Contabilidad/i-Cheque-Documento';
import { iCheque } from '../../../Interface/Contabilidad/i-Cheque';
import { iCuenta } from 'src/app/Interface/Contabilidad/i-Cuenta';
import { AsientoContableComponent } from '../../asiento-contable/nuevo-asiento-contable/asiento-contable/asiento-contable.component';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { iCentroCosto } from 'src/app/Interface/Contabilidad/i-Centro-Costo';
import { iChequePOST } from '../../../Interface/Contabilidad/i-Cheque-POST';
import { iOrderBy } from 'src/app/SHARED/interface/i-OrderBy';
import { PDFDocument } from 'pdf-lib';
import printJS from 'print-js';
import { RetencionComponent } from '../../retencion/retencion.component';
import { iRetencion } from 'src/app/Interface/Contabilidad/i-Retencion';
import { MatMenuTrigger } from '@angular/material/menu';
import { iOrdenCompraCentroGasto } from 'src/app/Interface/Proveedor/i-OrdenCompra-CentroGasto';
import { iAnticipoDoc } from 'src/app/Interface/Contabilidad/i-Anticipo-Doc';

@Component({
    selector: 'app-cheque-saldo',
    templateUrl: './cheque-saldo.component.html',
    styleUrl: './cheque-saldo.component.scss',
    standalone: false
})


export class ChequesSaldoComponent {
  public overlaySettings: OverlaySettings = {};
  public val = new Validacion();
  public valTabla = new Validacion();
  // public load :boolean = false;
  private IdMoneda: string = "";

  lstProveedor: iProveedor[] = [];
  lstCuenta: iCuenta[] = [];
  public lstCuentabancaria: iCuentaBancaria[] = [];
  lstBodega: iBodega[] = [];
  lstCentroCosto: iCentroCosto[] = [];
  lstRetencion: iRetencion[] = [];
  lstRetencionAutomatica: iRetencion[] = [];



  @ViewChildren(IgxComboComponent)
  public cmbCuenta: QueryList<IgxComboComponent>;

  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iChequeDocumento>;
  private lstDetalleAsiento: iAsientoDetalle[] = [];
  private lstOrdenCompraCentroGasto : iOrdenCompraCentroGasto[] = [];
  private lstAnticipo: iAnticipoDoc[] = [];

  public FILA: iCheque= {} as iCheque;
  public Asiento: iAsiento = {} as iAsiento;


  public esModal: boolean = false;
  public TC: number;
  public Anulado: boolean = false;
  public dec_Banco: number = 0;
  public dec_Disponible: number = 0;
  public dec_Aplicado: number = 0;
  public dec_Dif: number = 0;
  public dec_Retencion: number = 0;
  private CuentaComision : string = "6101-04-01-0007";
  private CuentaDiferencialPerdida: string = "6101-04-01-0004";
  private CuentaDiferencialGancia : string = "6101-04-01-0006";

 
  @ViewChildren(IgxComboComponent)
  public cmbCombo: QueryList<IgxComboComponent>; 

  @ViewChild("datepiker", { static: false })
  public datepiker: any;

  public orderby: iOrderBy[] = [
    { Columna: "Operacion", Direccion: "" },
    { Columna: "TipoDocumento", Direccion: "" },
    { Columna: "Documento", Direccion: "" },
    { Columna: "Fecha", Direccion: "" },
  ];
 

  constructor(public cFunciones: Funciones, private GET: getCheques, private POST: postCheque) {


    
    this.val.add("cmbCuentaBancaria", "1", "LEN>", "0", "No Cuenta", "Seleccione una cuenta bancaria.");
    this.val.add("txtNombreCuenta", "1", "LEN>", "0", "No Cuenta", "No se ha definido el nombre de la cuenta.");
    this.val.add("cmbCentroCosto", "1", "LEN>=", "0", "Centro Costo", "Seleccione un centro costo.");
    this.val.add("txtBanco", "1", "LEN>", "0", "Banco", "No se ha definido el banco.");
    this.val.add("cmbBodega", "1", "LEN>", "0", "Sucursal", "Seleccione una sucursal.");
    this.val.add("txtNoDoc", "1", "LEN>", "0", "No Doc", "No se ha definido el número de consecutivo.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Ingrese una fecha valida.");
    this.val.add("cmbProveedor", "1", "LEN>", "0", "Proveedor", "Seleccione un proveedor.");
    this.val.add("txtMoneda", "1", "LEN>", "0", "Moneda", "No se ha especificado la moneda de la cuenta.");
    this.val.add("txtBeneficiario", "1", "LEN>", "0", "Beneficiario", "No se ha especificado al Beneficiario.");
    this.val.add("TxtTC", "1", "NUM>", "0", "Tasa Cambio", "No se ha configurado el tipo de cambio.");
    this.val.add("txtComision", "1", "NUM>=", "0", "Banco", "Revisar la comisión bancaria.");
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
        this.FILA.IdCheque = "00000000-0000-0000-0000-000000000000";
        this.dec_Banco = 0;
        this.dec_Aplicado = 0;
        this.dec_Disponible = 0;        
        this.dec_Dif = 0;
        this.Asiento = {} as iAsiento;
        this.Asiento.IdAsiento = -1;

        this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
        this.lstOrdenCompraCentroGasto.splice(0, this.lstOrdenCompraCentroGasto.length);
        this.lstDetalle = new MatTableDataSource<iChequeDocumento>;
        this.lstRetencion.splice(0, this.lstRetencion.length);




        this.val.Get("cmbCuentaBancaria").setValue("");
        this.val.Get("txtNombreCuenta").setValue("");
        this.val.Get("txtBanco").setValue("");
        this.val.Get("cmbBodega").setValue("");
        this.val.Get("txtNoDoc").setValue("");
        this.val.Get("txtFecha").setValue(this.cFunciones.ShortFechaServidor());
        this.val.Get("cmbProveedor").setValue("");
        this.val.Get("txtMoneda").setValue("");
        this.val.Get("txtConcepto").setValue("");
        this.val.Get("txtBeneficiario").setValue("");
        this.val.Get("txtTotalDolar").setValue("0.00");
        this.val.Get("txtTotalCordoba").setValue("0.00");
        this.val.Get("txtComision").setValue("0.00");


        this.val.Get("txtNombreCuenta").disable();
        this.val.Get("txtBanco").disable();
        this.val.Get("txtNoDoc").disable();
        this.val.Get("txtMoneda").disable();
        //this.val.Get("TxtTC").disable();
        this.val.Get("txtTotalDolar").disable();
        this.val.Get("txtTotalCordoba").disable();
        this.val.Get("txtComision").disable();


        if (this.lstBodega.length > 0) this.cmbBodega?.setSelectedItem(this.lstBodega[0].Codigo);


        this.V_TasaCambios();

        var bod: any = document.getElementById("body");
        if (bod != undefined) bod.style.overflow = "";


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
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      let _Item = this.lstCuentabancaria.find(f => f.IdCuentaBanco == event.newValue[0]);

      this.val.Get("cmbCuentaBancaria").setValue(event.newValue[0]);
      this.val.Get("txtNombreCuenta").setValue(_Item?.NombreCuenta);
      this.val.Get("txtBanco").setValue(_Item?.Banco);
      this.val.Get("txtMoneda").setValue(_Item?.Moneda);
      this.val.Get("txtNoDoc").setValue(_Item?.Consecutivo);
      //this.v_Consecutivo();

      if (this.IdMoneda != _Item?.IdMoneda) {
        this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
        this.lstDetalle._updateChangeSubscription();
        this.lstRetencion.splice(0, this.lstRetencion.length);
        this.lstOrdenCompraCentroGasto.splice(0, this.lstOrdenCompraCentroGasto.length);
      }
      this.IdMoneda = String(_Item?.IdMoneda);
      this.cmbCuentaBancaria.close();

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



  @ViewChild("cmbCentroCosto", { static: false })
  public cmbCentroCosto: IgxComboComponent;

  public v_Select_CentroCosto(event: any) {

    if (event.added.length == 1) {

      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbCentroCosto").setValue(event.newValue);
      this.cmbCentroCosto.close();
    }
  }

  public v_Enter_CentroCosto(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbCentroCosto.dropdown;
      let _Item: iCentroCosto = cmb._focusedItem.value;
      this.cmbCentroCosto.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbCentroCosto").setValue([_Item.Codigo]);

    }
  }






  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  public v_Select_Bodega(event: any) {
    this.val.Get("cmbBodega").setValue("");
    if (event.added.length == 1) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbBodega").setValue(event.newValue);
      this.cmbBodega.close();
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
    this.lstRetencion.splice(0, this.lstRetencion.length);
    this.lstOrdenCompraCentroGasto.splice(0, this.lstOrdenCompraCentroGasto.length);
    this.lstDetalle._updateChangeSubscription();

    if (event.added.length == 1) {

      if (event.newValue.length > 1) event.newValue.splice(0, 1);

      // this.val.Get("cmbProveedor").setValue(event.newValue);
      // let cmb: any = this.cmbProveedor.dropdown;
      // let _Item: iProveedor = cmb._focusedItem.value;
      // this.cmbProveedor.setSelectedItem(_Item.Codigo);
      // this.val.Get("txtBeneficiario").setValue( _Item.Proveedor);
      this.val.Get("cmbProveedor").setValue(event.newValue);

      this.cmbProveedor.close();
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

    

  }


  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

  public v_CargarDatos(): void {


    document.getElementById("btnRefrescar-Cheque")?.setAttribute("disabled", "disabled");


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
            this.lstCentroCosto = datos[3].d;
            this.lstProveedor = datos[4].d;


            if (this.cmbBodega.selection.length == 0) this.cmbBodega.setSelectedItem(this.lstBodega[0]?.Codigo);


            if (this.cmbBodega.selection.length != 0) {
              let i_C = this.lstCuentabancaria.find(f => f.IdCuentaBanco == this.val.Get("cmbCuentaBancaria").value[0])
              this.val.Get("txtNombreCuenta").setValue(i_C?.NombreCuenta);
              this.val.Get("txtBanco").setValue(i_C?.Banco);
              this.val.Get("txtMoneda").setValue(i_C?.Moneda);
              this.val.Get("txtNoDoc").setValue(i_C?.Consecutivo);
              
              this.IdMoneda = String(i_C?.IdMoneda);
              if (!this.esModal) this.V_Calcular();
              if (!this.esModal) this.V_Contabilizacion();
            }



            this.V_TasaCambios();
            if (this.esModal) this.v_Visualizar();


          }

        },
        error: (err) => {


          dialogRef.close();

          document.getElementById("btnRefrescar-Cheque")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => { document.getElementById("btnRefrescar-Cheque")?.removeAttribute("disabled"); }
      }
    );


  }









// public v_Consecutivo(): void {

// let Fecha1 : string = this.cFunciones.DateFormat(this.val.Get("txtFecha").value, "yyyy-MM-dd");

//     this.cFunciones.GET.Consecutivo("CK", this.val.Get("txtFecha").value).subscribe(
//       {
//         next: (data) => {

//           let _json: any = data;

//           if (_json["esError"] == 1) {
//             if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
//               this.cFunciones.DIALOG.open(DialogErrorComponent, {
//                 id: "error-servidor-msj",
//                 data: _json["msj"].Mensaje,
//               });
//             }
//           } else {

//             let datos: iDatos = _json["d"];
//             if (!this.esModal) this.val.Get("txtNoDoc").setValue(String(datos.d).replaceAll("$", this.cFunciones.DateFormat(this.val.Get("txtFecha").value, "YYYYMM")));


//           }

//         },
//         error: (err) => {

//           this.cFunciones.DIALOG.open(DialogErrorComponent, {
//             data: "<b class='error'>" + err.message + "</b>",
//           });

//         },
//       }
//     );
//   }

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
            //this.v_ConvertirTotal("");
            this.V_CalcularSaldo();
            //this.V_Calcular();

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


  public V_Selecionar(det: any) {

    if (det.Operacion != "Cancelación") det.Seleccionar = false
    /*
        setTimeout(() => {
    
    
    
          if (det.Seleccionar) {
            det.Importe = det.Saldo;
            det.Operacion = "Cancelación";
            
          }
          else
          {
            det.Importe = "0";
            det.Operacion = "";
          }
    
    
          this.V_Calcular();
        });
    */


  }



  public v_BuscarDocumentos(): void {

    if (this.esModal) return;


    this.val.ItemValido(["cmbCuentaBancaria", "cmbProveedor", "TxtTC"]);

    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }



    this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
    this.lstOrdenCompraCentroGasto.splice(0, this.lstOrdenCompraCentroGasto.length);
    this.lstRetencion.splice(0, this.lstRetencion.length);

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

            let datos: iDatos[] = _json["d"];


            this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
            this.lstOrdenCompraCentroGasto.splice(0, this.lstOrdenCompraCentroGasto.length);
            this.lstRetencion.splice(0, this.lstRetencion.length);
            this.lstDetalle.data = datos[0].d;
            this.lstOrdenCompraCentroGasto = datos[1].d;
            this.lstAnticipo = datos[2].d;
            this.lstRetencionAutomatica = datos[3].d;

            this.V_CalcularSaldo();
  
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


 public V_CalcularSaldo() {

    this.TC = this.cFunciones.Redondeo(Number(String(this.val.Get("TxtTC").value).replaceAll(",", "")), "4");

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

      if(f.Retenido == undefined) f.Retenido = false;
      if (f.Importe == undefined) f.Importe = "0.00";
      f.Saldo = this.cFunciones.NumFormat(saldo, "2");
      f.SaldoCordoba = this.cFunciones.Redondeo(saldoCordoba, "2");
      f.SaldoDolar = this.cFunciones.Redondeo(saldoDolar, "2");

    });

    this.V_Calcular();
  }

  public V_Calcular(): void {


 

    this.TC = this.cFunciones.Redondeo(Number(String(this.val.Get("TxtTC").value).replaceAll(",", "")), "4");
    this.val.Get("TxtTC").setValue(this.TC);

    this.v_ConvertirTotal("");



    this.dec_Aplicado = 0;
    this.dec_Dif = 0;
    this.dec_Retencion = 0;



    this.lstDetalle.data.forEach(f => {

      f.Operacion = "";
      f.Retenido = false;
      f.IdCheque = this.FILA.IdCheque;
      if (f.IdDetChequeDoc == undefined) f.IdDetChequeDoc = "00000000-0000-0000-0000-000000000000";

      let Importe: number = this.cFunciones.Redondeo(Number(String(f.Importe).replaceAll(",", "")), "2");
      let Saldo: number = Number(String(f.Saldo).replaceAll(",", ""));


      let OrdComp: iOrdenCompraCentroGasto[] = this.lstOrdenCompraCentroGasto.filter(g => g.NoDocOrigen == f.Documento && g.TipoDocOrigen == f.TipoDocumento)

      let TipoDo: string[] = ["GASTO_ANT"];


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

      if (f.Operacion != "Cancelación" && f.Seleccionar) f.Seleccionar = false;
      // f.Importe = this.cFunciones.NumFormat(Importe, "2");
      // f.NuevoSaldo = this.cFunciones.NumFormat(NuevoSaldo, "2");
      // f.NuevoSaldoML = 0;
      // f.NuevoSaldoMS = 0;
      // this.dec_Aplicado += Importe;

      if(TipoDo.includes(f.TipoDocumento))
        {
          if(OrdComp.length > 0 && f.Operacion == "Cancelación")
          {
            if(!OrdComp[0].PuedeCancelar)
            {
              Importe = 0;
              f.Operacion = "";
              NuevoSaldo = Saldo;
            }
            
          }
        }


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


      //RETENCIONES


      let l_retenciones: iRetencion[] = this.lstRetencion.filter(w => w.Documento == f.Documento && w.TipoDocumento == f.TipoDocumento);



      if (l_retenciones.length == 0 && f.Operacion == "Cancelación") l_retenciones = this.lstRetencionAutomatica.filter(w => w.Documento == f.Documento && w.TipoDocumento == f.TipoDocumento);
    
      
      l_retenciones.forEach(r => {

        if (Number(String(r.Monto).replaceAll(",", "")) != 0) {
          let Porc: number = 1 + r.PorcImpuesto;
          let SubTotal: number = r.SubTotal; //this.cFunciones.Redondeo(Importe / Porc, "2");
          //let SubTotal: number = Importe;
          let Ret: number = this.cFunciones.Redondeo(SubTotal * this.cFunciones.Redondeo(r.Porcentaje / 100, "2"), "4");
          if (!r.RetManual) r.Monto = this.cFunciones.NumFormat(Ret, "2");
        }


        if (Importe == 0) r.Monto = "0";
        r.Monto = this.cFunciones.NumFormat(Number(String(r.Monto).replaceAll(",", "")), "4");


        let Retencion: number = Number(String(r.Monto).replaceAll(",", ""));
        this.dec_Retencion += Retencion;


        if (this.cFunciones.MonedaLocal == this.IdMoneda) {
          r.MontoML = this.cFunciones.Redondeo(Retencion, "4");
          r.MontoMS = this.cFunciones.Redondeo(r.MontoML / this.TC, "4");

        }
        else {
          r.MontoMS = this.cFunciones.Redondeo(Retencion, "4");
          r.MontoML = this.cFunciones.Redondeo(r.MontoMS * this.TC, "4");
        }

        if (Retencion != 0) f.Retenido = true;


        if (f.Operacion == "Abono") {
          f.Retenido = false;
          r.Monto = "0.00";
          r.MontoML = 0;
          r.MontoMS = 0;
          this.dec_Retencion -= Retencion;
        }

        if (r.Naturaleza == "D") this.dec_Retencion -= Retencion;


      })


    


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






    if (this.IdMoneda != "undefined" && this.IdMoneda != "") {


      this.val.Get("txtComision").enable();

      this.dec_Banco = this.dec_Aplicado - this.dec_Retencion;

      if (this.IdMoneda == this.cFunciones.MonedaLocal) {

        this.val.Get("txtTotalCordoba").setValue(this.cFunciones.NumFormat(this.dec_Banco, "2"))
      }
      else {
        this.val.Get("txtTotalDolar").setValue(this.cFunciones.NumFormat(this.dec_Banco, "2"))

      }


      this.v_ConvertirTotal("");
    }


  }

  public V_Mostrar_Asiento() { 
  
      this.val.Combo(this.cmbCombo);
      this.val.ItemValido(["cmbCuentaBancaria", "cmbCentroCosto", "cmbProveedor"]);
  
  
      if (this.val.Errores != "") {
        this.cFunciones.DIALOG.open(DialogErrorComponent, {
          data: this.val.Errores,
        });
  
        return;
      }
  
  
  
      //if (!this.esModal) this.V_Contabilizacion();
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
        dialogAsiento.componentInstance.FILA = Asiento;
        dialogAsiento.componentInstance.NoDocumento = this.val.GetValue("txtNoDoc");
  
        dialogAsiento.afterOpened().subscribe(s => {
  
          
          dialogAsiento.componentInstance.Editar = false;
          dialogAsiento.componentInstance.val.Get("chk-asiento-revisado").setValue(true);
          dialogAsiento.componentInstance.val.Get("chk-asiento-revisado").disable();
  
        });
  
        dialogAsiento.beforeClosed().subscribe(s => {
  
          
          $("#offcanvasBottom-cheque-saldo").removeAttr("show");
          $("#btnMostrarPie-cheque-saldo").trigger("click"); 
  
        });
  
      });
  
  
    
  
  
    }

 private V_Contabilizacion(): void {
    this.lstDetalleAsiento.splice(0, this.lstDetalleAsiento.length);




    if(!this.esModal){
      this.Asiento = {} as iAsiento;
    }


    this.Asiento.AsientosContablesDetalle = this.lstDetalleAsiento;

    let i_Prov: iProveedor = this.lstProveedor.find(f => f.Codigo == this.val.Get("cmbProveedor").value[0])!;
    let i_Banco: any = this.lstCuentabancaria.find(f => f.IdCuentaBanco == this.val.Get("cmbCuentaBancaria").value[0])!;

    let TotalBanco: number = (this.IdMoneda == this.cFunciones.MonedaLocal ? Number(this.val.Get("txtTotalCordoba").value.replaceAll(",", "")) : Number(this.val.Get("txtTotalDolar").value.replaceAll(",", "")));
    let Comision: number = Number(this.val.Get("txtComision").value.replaceAll(",", ""));



    if (i_Banco == undefined) return;



    this.Asiento.NoDocOrigen = this.val.Get("txtNoDoc").value;
    this.Asiento.IdSerieDocOrigen = i_Banco.IdSerie;
    this.Asiento.TipoDocOrigen = "CHEQUE A DOCUMENTO";

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
    this.Asiento.Estado = "AUTORIZADO";
    this.Asiento.TipoAsiento = "ASIENTO BASE";
    this.Asiento.NoAsiento = "";



    this.Nueva_Linea_Asiento(TotalBanco, (this.IdMoneda == this.cFunciones.MonedaLocal ? i_Banco.CuentaNuevaC : i_Banco.CuentaNuevaD), this.val.GetValue("txtConcepto") + " " + i_Banco.CuentaBancaria, "", "", "C", "");
    this.Nueva_Linea_Asiento(Comision, (this.IdMoneda == this.cFunciones.MonedaLocal ? i_Banco.CuentaNuevaC : i_Banco.CuentaNuevaD), this.val.GetValue("txtConcepto") + " " +  i_Banco.CuentaBancaria, "", "", "C", "");
    this.Nueva_Linea_Asiento(Comision, this.CuentaComision, this.val.GetValue("txtConcepto") + " " + "COMISION BANCARIA Doc:" + this.Asiento.NoDocOrigen,  this.Asiento.NoDocOrigen, "", "D", "");


    this.lstDetalle.data.filter(f => Number(f.Importe.replaceAll(",", "")) > 0).forEach(f => {

      let det: iAsientoDetalle = {} as iAsientoDetalle;

      let OrdComp: iOrdenCompraCentroGasto[] = this.lstOrdenCompraCentroGasto.filter(g => g.NoDocOrigen == f.Documento && g.TipoDocOrigen == f.TipoDocumento)

      let TipoDo: string[] = ["GASTO_ANT", "GASTO_REN", "GASTO_VIA", "GASTO_CRE"];

      let Cuenta: string = i_Prov.CUENTAXPAGAR;
      let CuentaAux : string = "";

      if (TipoDo.includes(f.TipoDocumento)) {
        Cuenta = "";
        if (OrdComp.length > 0) {
          Cuenta = OrdComp[0].CuentaContableSolicitante;
        }
      }

        if(f.TipoDocumento == "GASTO_CRE") Cuenta = i_Prov.CUENTAANTICIPO


      if (f.TipoDocumento == "GASTO_ANT" || f.TipoDocumento == "GASTO_CRE") {

        if (f.Operacion == "Abono") {

          if(f.TipoDocumento == "GASTO_CRE") Cuenta = i_Prov.CUENTAANTICIPO

          if (this.IdMoneda == this.cFunciones.MonedaLocal) {
            det = this.Nueva_Linea_Asiento(Number(f.Importe.replaceAll(",", "")), Cuenta, this.cmbProveedor.displayValue  + " " + f.Documento, f.Documento, f.TipoDocumento, "D", "");
          }
          else {
            det = this.Nueva_Linea_Asiento(Number(f.Importe.replaceAll(",", "")), Cuenta, this.cmbProveedor.displayValue  + " " + f.Documento, f.Documento, f.TipoDocumento, "D", "");

          }


          det.DebitoML += f.DiferencialML;
          det.DebitoMS += f.DiferencialMS;


        }
        else {


          let Anticipo: number = 0;
          let Impuesto: number = 0;





        


          if (this.IdMoneda == this.cFunciones.MonedaLocal) {
            Anticipo = this.lstAnticipo.filter(w => w.Documento == f.Documento && w.TipoDocumento == f.TipoDocumento && w.Serie == f.Serie).reduce((acc, cur) => acc + Number(cur.AnticipoCordoba), 0);
        
            Impuesto = this.lstRetencionAutomatica.filter(w => w.Documento == f.Documento && w.TipoDocumento == f.TipoDocumento && w.Serie == f.Serie && w.TieneImpuesto).reduce((acc, cur) => acc + Number(cur.MontoML), 0);
        
          }
          else {
            Anticipo = this.lstAnticipo.filter(w => w.Documento == f.Documento && w.TipoDocumento == f.TipoDocumento && w.Serie == f.Serie).reduce((acc, cur) => acc + Number(cur.AnticipoDolar), 0);
            Impuesto = this.lstRetencionAutomatica.filter(w => w.Documento == f.Documento && w.TipoDocumento == f.TipoDocumento && w.Serie == f.Serie && w.TieneImpuesto).reduce((acc, cur) => acc + Number(cur.MontoMS), 0);
        

          }

          CuentaAux = Cuenta;
          if(f.TipoDocumento == "GASTO_CRE") Cuenta = i_Prov.CUENTAANTICIPO


          if (Anticipo != 0) {
            det = this.Nueva_Linea_Asiento(Anticipo, Cuenta, this.cmbProveedor.displayValue  + " " + "Anticipo. " + f.Documento, f.Documento, f.TipoDocumento, "C", "");
          }

          Cuenta = CuentaAux;





          let ImporteAuxML: number = 0;
          let ImporteAuxMS: number = 0;
          let Importe_ML : number = 0;
          let Importe_MS : number = 0;
          let DifML: number = 0;
          let DifMS: number = 0;

          OrdComp.forEach(g => {

            let Importe = 0;//Number(f.Importe.replaceAll(",", ""));

            if (this.IdMoneda == this.cFunciones.MonedaLocal) {
              Importe = g.SubTotalCordoba;
            }
            else {
              Importe = g.SubTotalDolar;
            }

              

            Importe_MS = g.SubTotalDolar;
            Importe_ML = g.SubTotalCordoba;
            


            //Importe = this.cFunciones.Redondeo(((Importe - Impuesto) * (g.Participacion1 / 100.00)) * (g.Participacion2 / 100.00), "2");
            Importe = this.cFunciones.Redondeo(g.Participacion1 , "2");

            
               if(g.TipoDocOrigen.includes("GASTO") && f.Operacion != "Abono"){

                if(this.cFunciones.MonedaLocal == this.IdMoneda)
                {
                  Importe+= g.ImpuestoCordoba;
                }
                else
                {
                  Importe+= g.ImpuestoDolar;
                }

                Importe_MS += g.ImpuestoDolar;
                Importe_ML += g.ImpuestoCordoba;
                
              
              }



             let Cuentagasto = g.CuentaContable;
            if(f.TipoDocumento == "GASTO_CRE") Cuentagasto = i_Prov.CUENTAANTICIPO

            if (this.IdMoneda == this.cFunciones.MonedaLocal) {
              det = this.Nueva_Linea_Asiento((Importe - Impuesto) , Cuentagasto, f.Documento, f.Documento, f.TipoDocumento, "D", "");
            }
            else {
              det = this.Nueva_Linea_Asiento((Importe - Impuesto) , Cuentagasto, f.Documento, f.Documento, f.TipoDocumento, "D", "");

            }

            det.CentroCosto = g.CentroCosto;
            DifML += f.DiferencialML;
            DifMS += f.DiferencialMS;



            ImporteAuxML += det.DebitoML;
            ImporteAuxMS += det.DebitoMS;






          });




          det.DebitoML += this.cFunciones.Redondeo(Importe_ML - ImporteAuxML, "2");
          det.DebitoMS += this.cFunciones.Redondeo(Importe_MS - ImporteAuxMS, "2");



          if (f.ImporteML - ImporteAuxML != 0) {
            f.DiferencialML = this.cFunciones.Redondeo(DifML, "2");
          }

          if (f.ImporteMS - ImporteAuxMS != 0) {

            f.DiferencialMS = this.cFunciones.Redondeo(DifMS, "2");

          }



          det.DebitoML = this.cFunciones.Redondeo(det.DebitoML, "2");
          det.DebitoMS = this.cFunciones.Redondeo(det.DebitoMS, "2");



        }

      }
      else {


        let Impuesto: number = 0;


        if (f.Operacion != "Abono")
        {
          if (this.IdMoneda == this.cFunciones.MonedaLocal) {

            Impuesto = this.lstRetencionAutomatica.filter(w => w.Documento == f.Documento && w.TipoDocumento == f.TipoDocumento && w.Serie == f.Serie && w.TieneImpuesto).reduce((acc, cur) => acc + Number(cur.MontoML), 0);
        
          }
          else {
          
            Impuesto = this.lstRetencionAutomatica.filter(w => w.Documento == f.Documento && w.TipoDocumento == f.TipoDocumento && w.Serie == f.Serie && w.TieneImpuesto).reduce((acc, cur) => acc + Number(cur.MontoMS), 0);
        
  
          }
        }
        
       


      
    
        if (this.IdMoneda == this.cFunciones.MonedaLocal) {
          det = this.Nueva_Linea_Asiento(Number(f.Importe.replaceAll(",", "") ) - Impuesto, Cuenta, this.cmbProveedor.displayValue  + " " + f.Documento, f.Documento, f.TipoDocumento, "D", "");
        }
        else {
          det = this.Nueva_Linea_Asiento(Number(f.Importe.replaceAll(",", "") ) - Impuesto, Cuenta, this.cmbProveedor.displayValue  + " " + f.Documento, f.Documento, f.TipoDocumento, "D", "");

        }


        det.DebitoML += f.DiferencialML;
        det.DebitoMS += f.DiferencialMS;
      }






      /*
      
      
           if(OrdComp.length == 0 && !TipoDo.includes( det.TipoDocumento ) )
           {
            if (this.IdMoneda == this.cFunciones.MonedaLocal) {
              det = this.Nueva_Linea_Asiento(Number(f.Importe.replaceAll(",", "")), i_Prov.CUENTAXPAGAR, f.Documento, f.Documento, f.TipoDocumento, "D", "");
            }
            else {
              det = this.Nueva_Linea_Asiento(Number(f.Importe.replaceAll(",", "")), i_Prov.CUENTAXPAGAR, f.Documento, f.Documento, f.TipoDocumento, "D", "");
      
            }
      
            
            det.DebitoML += f.DiferencialML;
            det.DebitoMS += f.DiferencialMS;
       
       
           }
           else{
      
      
            let ImporteAuxML : number = 0;
            let ImporteAuxMS : number = 0;
            let DifML : number = 0;
            let DifMS : number = 0;
            OrdComp.forEach(g =>{
      
              let Importe = Number(f.Importe.replaceAll(",", ""));
              
              Importe = this.cFunciones.Redondeo((Importe * (g.Participacion1 / 100.00) ) * (g.Participacion2 / 100.00), "2");
      
              if (this.IdMoneda == this.cFunciones.MonedaLocal) {
                det = this.Nueva_Linea_Asiento(Importe, g.CuentaContable, f.Documento, f.Documento, f.TipoDocumento, "D", "");
              }
              else {
                det = this.Nueva_Linea_Asiento(Importe, g.CuentaContable, f.Documento, f.Documento, f.TipoDocumento, "D", "");
        
              }
      
              det.CentroCosto = g.CentroCosto;
              DifML += f.DiferencialML;
              DifMS += f.DiferencialMS;
       
              
                  
              ImporteAuxML += det.DebitoML;
              ImporteAuxMS += det.DebitoMS;
      
      
              
      
              
            });
      
            det.DebitoML += this.cFunciones.Redondeo(f.ImporteML - ImporteAuxML, "2");
            det.DebitoMS += this.cFunciones.Redondeo(f.ImporteMS - ImporteAuxMS, "2");
      
      
      
            f.DiferencialML = this.cFunciones.Redondeo(DifML, "2");
            f.DiferencialMS = this.cFunciones.Redondeo(DifMS, "2");
       
      
            det.DebitoML = this.cFunciones.Redondeo(det.DebitoML, "2");
            det.DebitoMS = this.cFunciones.Redondeo(det.DebitoMS, "2");
      
      
           }
      
         
      */

      if (f.DiferencialML != 0 && f.DiferencialML < 0) this.Nueva_Linea_Asiento(Math.abs(f.DiferencialML), this.CuentaDiferencialPerdida, "P DIFERENCIAL Doc:" + f.Documento, f.Documento, f.TipoDocumento, "D", "ML");
      if (f.DiferencialMS != 0 && f.DiferencialMS < 0) this.Nueva_Linea_Asiento(Math.abs(f.DiferencialMS), this.CuentaDiferencialPerdida, "P DIFERENCIAL Doc:" + f.Documento, f.Documento, f.TipoDocumento, "D", "MS");

      if (f.DiferencialML != 0 && f.DiferencialML > 0) this.Nueva_Linea_Asiento(f.DiferencialML, this.CuentaDiferencialGancia, "G DIFERENCIAL Doc:" + f.Documento, f.Documento, f.TipoDocumento, "C", "ML");
      if (f.DiferencialMS != 0 && f.DiferencialMS > 0) this.Nueva_Linea_Asiento(f.DiferencialMS, this.CuentaDiferencialGancia, "G DIFERENCIAL Doc:" + f.Documento, f.Documento, f.TipoDocumento, "C", "MS");







      let RetML: number = 0;
      let RetMS: number = 0;

      let l_retenciones: iRetencion[] = this.lstRetencion.filter(w => w.Documento == f.Documento && w.TipoDocumento == f.TipoDocumento && Number(w.Monto.toString().replaceAll(",", "")) != 0);



      if (l_retenciones.length == 0) l_retenciones = this.lstRetencionAutomatica.filter(w => w.Documento == f.Documento && w.TipoDocumento == f.TipoDocumento && Number(w.Monto.toString().replaceAll(",", "")) != 0);

      if(f.Operacion == "Cancelación")
      {
        l_retenciones.forEach(w => {
          this.Nueva_Linea_Asiento(Number(w.Monto.toString().replaceAll(",", "")), w.CuentaContable, w.Retencion + " Doc:" + f.Documento, f.Documento, f.TipoDocumento, w.Naturaleza, "");
  
  
          RetML += w.MontoML;
          RetMS += w.MontoMS;
        });
  
      }
     


      //AJUSTE

      let AjusteMS: number = 0;
      let AjusteML: number = 0;

      if (this.IdMoneda == this.cFunciones.MonedaLocal) {

        AjusteMS = this.cFunciones.Redondeo(this.cFunciones.Redondeo(f.ImporteML - RetML, "2") / this.TC, "2");
        AjusteMS = this.cFunciones.Redondeo(f.ImporteMS - (AjusteMS + RetMS), "2");


      }
      else {

        AjusteML = this.cFunciones.Redondeo(this.cFunciones.Redondeo(f.ImporteMS - RetMS, "2") * this.TC, "2");
        AjusteML = this.cFunciones.Redondeo(f.ImporteML - (AjusteML + RetML), "2");

      }


      if (AjusteML < 0) this.Nueva_Linea_Asiento(Math.abs(AjusteML), this.CuentaDiferencialPerdida, "AJUSTE P DIFERENCIAL Doc:" + f.Documento, f.Documento, f.TipoDocumento, "D", "DIF_ML");
      if (AjusteMS < 0) this.Nueva_Linea_Asiento(Math.abs(AjusteMS), this.CuentaDiferencialPerdida, "AJUSTE P DIFERENCIAL Doc:" + f.Documento, f.Documento, f.TipoDocumento, "D", "DIF_MS");

      if (AjusteML > 0) this.Nueva_Linea_Asiento(AjusteML, this.CuentaDiferencialGancia, "AJUSTE G DIFERENCIAL Doc:" + f.Documento, f.Documento, f.TipoDocumento, "C", "DIF_ML");
      if (AjusteMS > 0) this.Nueva_Linea_Asiento(AjusteMS, this.CuentaDiferencialGancia, "AJUSTE G DIFERENCIAL Doc:" + f.Documento, f.Documento, f.TipoDocumento, "C", "DIF_MS");




    });



    let TotalCreditoML: number = this.lstDetalleAsiento.reduce((acc, cur) => acc + Number(cur.CreditoML), 0);
    let TotalCreditoMS: number = this.lstDetalleAsiento.reduce((acc, cur) => acc + Number(cur.CreditoMS), 0);

    let TotalDebitoML: number = this.lstDetalleAsiento.reduce((acc, cur) => acc + Number(cur.DebitoML), 0);
    let TotalDebitoMS: number = this.lstDetalleAsiento.reduce((acc, cur) => acc + Number(cur.DebitoMS), 0);

    let AjusteML = this.cFunciones.Redondeo(TotalCreditoML - TotalDebitoML, "2");
    let AjusteMS = this.cFunciones.Redondeo(TotalCreditoMS - TotalDebitoMS, "2");

    if (AjusteML > 0) {
      this.Nueva_Linea_Asiento(AjusteML, this.CuentaDiferencialGancia, "AJUSTE DIFERENCIAL", "", "", "D", "DIF_ML");
    }

    if (AjusteML < 0) {
      this.Nueva_Linea_Asiento(AjusteML, this.CuentaDiferencialPerdida, "AJUSTE DIFERENCIAL", "", "", "C", "DIF_ML");
    }




    if (AjusteMS > 0) {
      this.Nueva_Linea_Asiento(AjusteMS, this.CuentaDiferencialGancia, "AJUSTE DIFERENCIAL", "", "", "D", "DIF_MS");
    }

    if (AjusteMS < 0) {
      this.Nueva_Linea_Asiento(AjusteMS, this.CuentaDiferencialPerdida, "AJUSTE DIFERENCIAL", "", "", "C", "DIF_MS");
    }


    //ORDENANDO PRIMERO DEBITOS
    this.lstDetalleAsiento.sort((a, b) => b.DebitoML - a.DebitoML).forEach((item, index) => {
      item.NoLinea = index + 1;
      if(this.cFunciones.MonedaLocal == this.IdMoneda){
        item.Debito = String(item.DebitoML);
        item.Credito = String(item.CreditoML);
      }
      else{
        item.Debito = String(item.DebitoMS);
        item.Credito = String(item.CreditoMS);
      }
     });


    this.Asiento.AsientosContablesDetalle = JSON.parse(JSON.stringify(this.lstDetalleAsiento));


    
  }

    private Nueva_Linea_Asiento(Monto: number, Cuenta: string, Referencia: string, Documento: string, TipoDocumento: string, Naturaleza: string, Columna: string): iAsientoDetalle {

    let det: iAsientoDetalle = {} as iAsientoDetalle;

    if (Monto == 0) return det;
    Monto = this.cFunciones.Redondeo(Monto, "4");


    let i: number = 1;

    let i_Cuenta = this.lstCuenta.find(f => f.CuentaContable == Cuenta);

    if (this.lstDetalleAsiento.length > 0) i = Math.max(...this.lstDetalleAsiento.map(o => o.NoLinea)) + 1


    if(this.esModal){
      det.IdAsiento = this.Asiento.IdAsiento;
    }
    else{
      det.IdAsiento = -1;
    }

    det.NoLinea = i;
    det.CuentaContable = Cuenta;
    det.Modulo = "CON";
    det.Descripcion = i_Cuenta?.NombreCuenta!;
    det.Referencia = Referencia;
    det.CentroCosto = this.val.Get("cmbCentroCosto").value[0];
    det.Naturaleza = i_Cuenta?.Naturaleza!;
    det.NoDocumento = Documento
    det.TipoDocumento = TipoDocumento;



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


        case "DIF_ML":
          det.Debito = (this.IdMoneda == this.cFunciones.MonedaLocal, "0", String(Monto));
          det.DebitoML = Monto;
          det.DebitoMS = 0;
          break;
        case "DIF_MS":
          det.Debito = (this.IdMoneda != this.cFunciones.MonedaLocal, String(Monto), "0");
          det.DebitoMS = Monto;
          det.DebitoML = 0;
          break;


        default:

          if (this.cFunciones.MonedaLocal == this.IdMoneda) {
            det.Debito = String(Monto);
            det.DebitoML = Monto;
            det.DebitoMS = this.cFunciones.Redondeo(Monto / this.TC, "4");
          }
          else {
            det.Debito = String(Monto);
            det.DebitoMS = Monto;
            det.DebitoML = this.cFunciones.Redondeo(Monto * this.TC, "4");
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

        case "DIF_ML":
          det.Credito = (this.IdMoneda == this.cFunciones.MonedaLocal, "0", String(Monto));
          det.CreditoML = Monto;
          det.CreditoMS = 0;
          break;
        case "DIF_MS":
          det.Credito = (this.IdMoneda != this.cFunciones.MonedaLocal, String(Monto), "0");
          det.CreditoMS = Monto;
          det.CreditoML = 0;
          break;

        default:

          if (this.cFunciones.MonedaLocal == this.IdMoneda) {
            det.Credito = String(Monto);
            det.CreditoML = Monto;
            det.CreditoMS = this.cFunciones.Redondeo(Monto / this.TC, "4");
          }
          else {
            det.Credito = String(Monto);
            det.CreditoMS = Monto;
            det.CreditoML = this.cFunciones.Redondeo(Monto * this.TC, "4");
          }


          break;

      }


      det.Debito = "0";
      det.DebitoML = 0;
      det.DebitoMS = 0;
    }




    this.lstDetalleAsiento.push(det);


     det.DebitoML = this.cFunciones.Redondeo(det.DebitoML, "2");
    det.DebitoMS = this.cFunciones.Redondeo(det.DebitoMS, "2");
    det.CreditoML = this.cFunciones.Redondeo(det.CreditoML, "2");
    det.CreditoMS = this.cFunciones.Redondeo(det.CreditoMS, "2");

    return det;

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
  
  
      let Comision: number = Number(String(this.val.Get("txtComision").value).replaceAll(",", ""));
      let ComisionDolar: number = 0;
      let ComisionCordoba: number = 0;
  
  
      if (this.cFunciones.MonedaLocal == this.IdMoneda) {
        ComisionCordoba = this.cFunciones.Redondeo(Comision, "2");
        ComisionDolar = this.cFunciones.Redondeo(ComisionCordoba / this.TC, "2");
      }
      else {
        ComisionDolar = this.cFunciones.Redondeo(Comision, "2");
        ComisionCordoba = this.cFunciones.Redondeo(ComisionDolar * this.TC, "2");
      }
  
  
  
  
  
      this.FILA.IdCuentaBanco = this.val.Get("cmbCuentaBancaria").value[0];
      this.FILA.CodBodega = this.val.Get("cmbBodega").value[0];
      this.FILA.IdMoneda = this.IdMoneda;
      this.FILA.IdSerie = "CK"
      this.FILA.NoCheque = this.val.Get("txtNoDoc").value;
      this.FILA.Fecha = this.val.Get("txtFecha").value;
      this.FILA.Beneficiario = this.cmbProveedor.displayValue;//this.val.Get("txtBeneficiario").value;//this.cmbProveedor.displayValue;
      this.FILA.CodProveedor = this.val.Get("cmbProveedor").value[0];
      this.FILA.TasaCambio = this.val.Get("TxtTC").value;
      this.FILA.Concepto = this.val.Get("txtConcepto").value;
      this.FILA.Comision = Comision;
      this.FILA.ComisionCordoba = ComisionCordoba;
      this.FILA.ComisionDolar = ComisionDolar;
      this.FILA.TotalCordoba = Number(String(this.val.Get("txtTotalCordoba").value).replaceAll(",", ""));
      this.FILA.TotalDolar = Number(String(this.val.Get("txtTotalDolar").value).replaceAll(",", ""));
      this.FILA.Total = (this.cFunciones.MonedaLocal == this.IdMoneda ? this.FILA.TotalCordoba : this.FILA.TotalDolar);
      this.FILA.UsuarioReg = this.cFunciones.User;
      if (!this.esModal) this.FILA.Anulado = false;
      this.FILA.TipoCheque = "S";
      this.FILA.ChequeDocumento = JSON.parse(JSON.stringify(this.lstDetalle.data.filter(f => f.Operacion != "")));
      this.FILA.ChequeRetencion = JSON.parse(JSON.stringify(this.lstRetencion));  
    
      this.lstDetalle.data.filter(f => f.Operacion != "").forEach(w =>{

        if(this.lstRetencion.filter(ff => ff.Documento == w.Documento && ff.Serie == w.Serie && ff.TipoDocumento == w.TipoDocumento).length == 0)
        {
  
          this.lstRetencionAutomatica.filter(ff => ff.Documento == w.Documento && ff.Serie == w.Serie && ff.TipoDocumento == w.TipoDocumento).forEach(y =>{
  
  
            this.lstRetencion.push(y);
  
          });
  
  
        }
        
  
      })

      this.FILA.ChequeRetencion = JSON.parse(JSON.stringify(this.lstRetencion.filter(w => Number(w.Monto.toString().replaceAll(",", "")) != 0)));


      this.V_Contabilizacion();
  
      if (this.Asiento.AsientosContablesDetalle.findIndex(f => f.CuentaContable == "" || (f.Naturaleza == undefined || f.Naturaleza == "")) != -1) {
        this.cFunciones.DIALOG.open(DialogErrorComponent, {
          data: "<span><b>Por favor revisar el asiento contable. (CUENTA / NATURALEZA)</b></span>",
        });
  
        return;
      }
  
  
  
  
  
      let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
        WaitComponent,
        {
          panelClass: "escasan-dialog-full-blur",
          data: "",
        }
      );
  
      document.getElementById("btnGuardar-Transferencia-Saldo")?.setAttribute("disabled", "disabled");
  
  
      let Datos: iChequePOST = {} as iChequePOST;
      Datos.C = this.FILA;
      Datos.A = this.Asiento;
  
      this.POST.GuardarCheque(Datos).subscribe(
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
  
  
              if (!this.esModal) {
                //this.V_GenerarDoc(Datos[0], false);
                this.v_Evento("Iniciar");
              //this.v_Evento("Limpiar");
              }
  
            }
  
          },
          error: (err) => {
            dialogRef.close();
  
            document.getElementById("btnGuardar-Transferencia-Saldo")?.removeAttribute("disabled");
            if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor",
                data: "<b class='error'>" + err.message + "</b>",
              });
            }
          },
          complete: () => {
            document.getElementById("btnGuardar-Transferencia-Saldo")?.removeAttribute("disabled");
          }
        }
      );
  
  
    }


  private v_Visualizar() {

    this.cmbCuentaBancaria.setSelectedItem(this.FILA.IdCuentaBanco); 
    this.cmbBodega.setSelectedItem(this.FILA.CodBodega);
    this.cmbProveedor.setSelectedItem(this.FILA.CodProveedor);
    this.cmbCentroCosto.setSelectedItem(this.FILA.CentroCosto);
    this.val.Get("txtNoDoc").setValue(this.FILA.NoCheque);
    this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.FILA.Fecha, "yyyy-MM-dd"));
    this.val.Get("TxtTC").setValue(this.FILA.TasaCambio);
    this.val.Get("txtConcepto").setValue(this.FILA.Concepto);
    this.val.Get("txtBeneficiario").setValue(this.FILA.Beneficiario);
    this.val.Get("txtBeneficiario").setValue(this.FILA.Beneficiario);
    this.val.Get("txtTotalDolar").setValue(this.cFunciones.NumFormat(this.FILA.TotalDolar, "2"));
    this.val.Get("txtTotalCordoba").setValue(this.cFunciones.NumFormat(this.FILA.TotalCordoba, "2"));
    this.val.Get("txtComision").setValue(this.cFunciones.NumFormat(this.FILA.Comision, "2"));


    this.lstDetalle.data = JSON.parse(JSON.stringify(this.FILA.ChequeDocumento.sort((a, b) => 0 - (a.Index < b.Index ? 1 : -1))));
    this.lstRetencion = JSON.parse(JSON.stringify(this.FILA.ChequeRetencion.sort((a, b) => 0 - (a.Index < b.Index ? 1 : -1))));
    this.lstOrdenCompraCentroGasto = JSON.parse(JSON.stringify(this.FILA.OrdenCompraCentroGasto));

    // this.lstDetalle.data = JSON.parse(JSON.stringify(this.FILA.ChequeDocumento));
    // this.lstRetencion = JSON.parse(JSON.stringify(this.FILA.ChequeRetencion.sort((a, b) => 0 - (a.Index < b.Index ? 1 : -1))));
   

    this.IdMoneda = this.FILA.IdMoneda;

    this.TC = this.FILA.TasaCambio;
    this.Anulado = this.FILA.Anulado;





    let dialogRef: any = this.cFunciones.DIALOG.getDialogById("wait");
    if (dialogRef != undefined) dialogRef.close();


    this.lstDetalle._updateChangeSubscription();

  }

  public V_Ordenar_ColumnaCombo() : void{

    let c = (<HTMLInputElement>document.getElementById("cmbColumna")).value;
    let d = (<HTMLInputElement>document.getElementById("cmbDireccion")).value;

    let o : iOrderBy = this.orderby.find(f => f.Columna == c)!;
    if(d == "ASC") o.Direccion = "";
    if(d == "DESC") o.Direccion = "ASC";

    this.V_Ordenar_Columna(c);

  }

  public V_Ordenar_Columna(c: string): void {
 

    let o : iOrderBy = this.orderby.find(f => f.Columna == c)!;

    if(o.Direccion == "ASC")
    {
      o.Direccion = "DESC";
    }
    else
    {
      o.Direccion = "ASC";
    }

    this.lstDetalle.data.sort((a, b) => {

      switch (c) {
        case "Operacion":
          return 0 - (a.Operacion > b.Operacion ? (o.Direccion == "ASC" ? -1: 1) : (o.Direccion == "ASC" ? 1: -1));
          break;

        case "TipoDocumento":
          return 0 - (a.TipoDocumento > b.TipoDocumento ? (o.Direccion == "ASC" ? -1: 1) : (o.Direccion == "ASC" ? 1: -1));
          break;

        case "Documento":
          return 0 - (a.Documento > b.Documento ? (o.Direccion == "ASC" ? -1: 1) : (o.Direccion == "ASC" ? 1: -1));
          break;

        case "Fecha":
          return 0 - (a.Fecha > b.Fecha ? (o.Direccion == "ASC" ? -1: 1) : (o.Direccion == "ASC" ? 1: -1));
          break;
      }

      return 0 - (a.Index > b.Index ? -1 : 1);

    });
   

    // Ascending
    //this.lstDetalle.data.sort((a,b) => 0 - (a > b ? -1 : 1));

    // Descending
    //this.lstDetalle.data.sort((a, b) => 0 - (a.Fecha > b.Fecha ? 1 : -1));
    this.lstDetalle._updateChangeSubscription()

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


 public v_ImprimirCheque() {
     document.getElementById("btnImprimir-Cheques")?.setAttribute("disabled", "disabled");
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
 
 
 
     this.GET.GetRptCheques(this.val.Get("txtNoDoc").value).subscribe(
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
             this.printPDFS(datos.d);
 
 
 
           }
 
         },
         error: (err) => {
 
 
           dialogRef.close();
           document.getElementById("btnReporte-Cheque")?.removeAttribute("disabled");
           if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
             this.cFunciones.DIALOG.open(DialogErrorComponent, {
               id: "error-servidor",
               data: "<b class='error'>" + err.message + "</b>",
             });
           }
 
         },
         complete: () => {
           document.getElementById("btnImprimir-Cheques")?.removeAttribute("disabled");
 
 
         }
       }
     );
 
 
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

   V_Retener(item: iChequeDocumento): void {
 
     this.val.Combo(this.cmbCombo);
     this.val.ItemValido(["cmbCuentaBancaria", "cmbCentroCosto", "cmbProveedor"]);
 
 
 
     if (this.val.Errores != "") {
       this.cFunciones.DIALOG.open(DialogErrorComponent, {
         data: this.val.Errores,
       });
 
       return;
     }
 
     
         let Datos: iChequeDocumento[] = [];
     
     
         Datos.push(item);
     
         if (item.Seleccionar) {
           this.lstDetalle.data.filter(f => f.Seleccionar && f.Index != item.Index).forEach(f => {
             Datos.push(f);
           });
         }
     
 
     let dialogRef: MatDialogRef<RetencionComponent> = this.cFunciones.DIALOG.open(
       RetencionComponent,
       {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true,
        data: [Datos, item.Documento, this.IdMoneda]
       }
     );
 
     dialogRef.afterOpened().subscribe(s => {
 
 
       if (this.lstRetencion.filter((f: any) => f.Documento == item.Documento && f.TipoDocumento == item.TipoDocumento).length == 0) {
 
         dialogRef.componentInstance.v_BucarRetenciones();
 
       }
       else {
 
         let i: number = 0;
         this.lstRetencion.filter(w => w.Documento == item.Documento && w.TipoDocumento == item.TipoDocumento).forEach(f => {
 
           dialogRef.componentInstance.lstRetencion.data.push({
             IdDetRetencion: this.FILA.IdCheque,
             Seleccionar: (Number(f.Monto.replaceAll(",", "")) != 0 ? true : false),
             Index: i,
             IdRetencion: f.IdRetencion,
             Retencion: f.Retencion,
             Porcentaje: f.Porcentaje,
             Documento: f.Documento,
             TipoDocumento: f.TipoDocumento,
             Serie: f.Serie,
             SubTotal : f.SubTotal,
             SubTotalMS : f.SubTotalMS,
             SubTotalML : f.SubTotalML,
             Monto: f.Monto,
             PorcImpuesto: f.PorcImpuesto,
             TieneImpuesto: f.TieneImpuesto,
             CuentaContable: f.CuentaContable,
             RetManual : f.RetManual,
             Naturaleza : f.Naturaleza,
             AplicarAutomatico : f.AplicarAutomatico
           });
 
           i++;

           dialogRef.componentInstance.V_Calcular(i, undefined);
 
 
         });

         let Docs: string[] = [];
        Datos.filter(f => f.Seleccionar && f.Index != item.Index).forEach(f => {

          Docs.push(f.Documento + f.TipoDocumento);

        });


        this.lstRetencion.filter(w => Docs.includes(w.Documento + w.TipoDocumento)).forEach(f => {

          dialogRef.componentInstance.lstRetencion.data.push({
            IdDetRetencion: this.FILA.IdCheque,
            Seleccionar: (Number(f.Monto.replaceAll(",", "")) != 0 ? true : false),
            Index: i,
            IdRetencion: f.IdRetencion,
            Retencion: f.Retencion,
            Porcentaje: f.Porcentaje,
            Documento: f.Documento,
            TipoDocumento: f.TipoDocumento,
            Serie: f.Serie,
            SubTotal: f.SubTotal,
            SubTotalMS: f.SubTotalMS,
            SubTotalML: f.SubTotalML,
            Monto: f.Monto,
            PorcImpuesto: f.PorcImpuesto,
            TieneImpuesto: f.TieneImpuesto,
            CuentaContable: f.CuentaContable,
            RetManual: f.RetManual,
            Naturaleza: f.Naturaleza,
            AplicarAutomatico : f.AplicarAutomatico
          });

          i++;

          dialogRef.componentInstance.V_Calcular(i, undefined);

        });

        dialogRef.componentInstance.lstRetencion.filter = item.Documento;


        dialogRef.componentInstance.lstRetencion._updateChangeSubscription();
 
         
       }
 
     });
 
 
     dialogRef.afterClosed().subscribe(s => {
 
       dialogRef.componentInstance.lstRetencion.data.forEach(f => {
 
         let i: number = this.lstRetencion.findIndex(w => w.Documento == f.Documento && w.TipoDocumento == f.TipoDocumento && w.IdRetencion == f.IdRetencion)!;
         let esNuevo: boolean = false;
 
         let r: iRetencion = {} as iRetencion;
         if (i == -1) {
           esNuevo = true;
           r.IdDetRetencion = 0;
         }
         else {
           r = this.lstRetencion[i];
         } 
         
         r.IdDetRetencion = f.IdDetRetencion;
         r.IdTransferencia = this.FILA.IdCheque;
         r.Index = f.Index;
         r.IdRetencion = f.IdRetencion;
         r.Retencion = f.Retencion;
         r.Porcentaje = f.Porcentaje;
         r.Documento = f.Documento;
         r.Serie = f.Serie;
         r.TipoDocumento = f.TipoDocumento;
         r.IdMoneda = this.IdMoneda;
         r.TasaCambio = this.TC;
         r.SubTotal = f.SubTotal;
         r.Monto = f.Monto;
         r.MontoMS = 0;
         r.MontoML = 0;
         r.TieneImpuesto = f.TieneImpuesto;
         r.PorcImpuesto = f.PorcImpuesto;
         r.CuentaContable = f.CuentaContable;
         r.RetManual = f.RetManual;
         r.Naturaleza = f.Naturaleza;
         r.AplicarAutomatico = f.AplicarAutomatico
 
         
 
         if (esNuevo) this.lstRetencion.push(r);
 
 
       });
 
 
 
 
       this.V_Calcular();
     });
 
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
      let tabOrWindow: any = window.open('', '_blank');
      tabOrWindow.document.body.appendChild(fileLink);

      tabOrWindow.document.write("<html><head><title>" + Datos.Nombre + "</title></head><body>"
        + '<embed width="100%" height="100%" name="plugin" src="' + url + '" '
        + 'type="application/pdf" internalinstanceid="21"></body></html>');

      tabOrWindow.focus();
    }



  }


  async printPDFS(datos: any) {



    let byteArray = new Uint8Array(atob(datos).split('').map(char => char.charCodeAt(0)));

    var file = new Blob([byteArray], { type: 'application/pdf' });

    let url = URL.createObjectURL(file);

    let tabOrWindow : any = window.open(url, '_blank');
    tabOrWindow.focus();

    return
    let pdfsToMerge = [url];

  

    if (this.cFunciones.MyBrowser() == "Firefox") {
      let iframe = document.createElement('iframe');
      iframe.id = "frameBalanza";
      iframe.style.display = 'none';

      iframe.src = url
      document.body.appendChild(iframe);
      iframe.onload = () => {
        setTimeout(() => {
          iframe.focus();
          iframe.contentWindow?.print();


        });
      };

    }
    else {
      const mergedPdf = await PDFDocument.create();
      for (const pdfCopyDoc of pdfsToMerge) {
        const pdfBytes = await fetch(pdfCopyDoc).then(res => res.arrayBuffer())

        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page: any) => {
          mergedPdf.addPage(page);
        });
      }


      const mergedPdfFile = await mergedPdf.save();
      this.downloadFile(mergedPdfFile);
    }




  }


  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    printJS({
      printable: url,
      type: 'pdf',
      onPdfOpen: undefined,
      onPrintDialogClose: undefined
    })

  }


  ngDoCheck() {
    this.val.Combo(this.cmbCombo);
    this.val.addNumberFocus("TxtTC", 4);
    this.val.addNumberFocus("txtComision", 2);
    this.val.addNumberFocus("txtTotalCordoba", 2);
    this.val.addNumberFocus("txtTotalDolar", 2);


    this.val.addFocus("cmbCuentaBancaria", "cmbCentroCosto", undefined);
    this.val.addFocus("cmbCentroCosto", "cmbBodega", undefined);
    this.val.addFocus("cmbBodega", "cmbProveedor", undefined);
    this.val.addFocus("cmbProveedor", "txtConcepto", undefined);


    if(this.cmbCuentaBancaria != undefined) this.cmbCuentaBancaria.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth):  "720") + "px";
    if(this.cmbBodega != undefined) this.cmbBodega.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth):  "720") + "px";
    if(this.cmbCentroCosto != undefined) this.cmbCentroCosto.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth):  "720") + "px";
    if(this.cmbProveedor != undefined) this.cmbProveedor.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth):  "720") + "px";
    
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";
     



    this.lstDetalle.data.forEach(f => {
      this.val.addNumberFocus("txtImporte" + f.Index, 2);
      this.val.addFocus("txtImporte" + f.Index, "txtImporte" + (f.Index + 1), undefined);
    });


  }

  ngAfterViewInit(): void {
    $("#offcanvasBottom-cheque-saldo").removeAttr("show");
    $("#btnMostrarPie-cheque-saldo").trigger("click"); 

  }
}

