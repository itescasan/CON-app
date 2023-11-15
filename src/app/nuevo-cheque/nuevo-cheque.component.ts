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
import { iAsientoDetalle } from 'src/app/Interface/Contabilidad/i-Asiento-Detalle';
import { iAsiento } from 'src/app/Interface/Contabilidad/i-Asiento';
import { getCheques } from '../Contabilidad/Operaciones-bancarias/CRUD/GET/get-Cheques';
import { Observable, catchError, iif, map, startWith, tap } from 'rxjs';
import { reference } from '@popperjs/core';
import { ideaGeneration } from '@igniteui/material-icons-extended';
import { iCheque } from '../Interface/Contabilidad/i-Cheque';
import { iChequePOST } from '../Interface/Contabilidad/i-Cheque-POST';
import { postCheque } from '../Contabilidad/Operaciones-bancarias/CRUD/POST/post-Cheque';
import { iCentroCosto } from '../Interface/Contabilidad/i-Centro-Costo';


@Component({
  selector: 'app-nuevo-cheque',
  templateUrl: './nuevo-cheque.component.html',
  styleUrls: ['./nuevo-cheque.component.scss']
})
export class NuevoChequeComponent {

  public overlaySettings: OverlaySettings = {};
  public val = new Validacion();
  public valTabla = new Validacion();

  private IdMoneda : string = "";
  private Valor : number = 0.0;
  private Cuenta : string = "";
  private suma : number = 0.0;
  private sumaDebito : number = 0.0;
  private ret1 : number = 0.0;
  private ret2 : number = 0.0;
  private ret3 : number = 0.0;
  private ValorC : number = 0.0;
  private ValorCheque : number = 0.0;

  lstCuenta: iCuenta[] = [];
  public lstCuentabancaria : iCuentaBancaria[] = [];
  lstBodega: iBodega[] = [];
  lstCentroCosto: iCentroCosto[] = [];

  @ViewChildren(IgxComboComponent)
  public cmbCuenta: QueryList<IgxComboComponent>;

  @ViewChildren(IgxComboComponent) //esta variable es una vista para este componente
  public cmbCombo: QueryList<IgxComboComponent>;


  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iAsientoDetalle>;


  public FILA: iCheque = {} as iCheque;

  filteredCuenta: Observable<iCuenta[]> | undefined;

  public esModal: boolean = false;
  public dec_TotalDebe: number = 0;
  public dec_TotalHaber: number = 0;
  public dec_Dif: number = 0; 
  public TC: number;
  public Anulado : boolean = false;


  constructor(public cFunciones: Funciones, private GET: getCheques ,private POST : postCheque) {  

    this.val.add("cmbCuentaBancaria", "1", "LEN>", "0", "No Cuenta", "Seleccione una Cuenta de Banco.");
    this.val.add("txtNombreCuenta", "1", "LEN>", "0", "Nombre Cuenta", "No se ha definido el nombre de la cuenta.");
    this.val.add("txtBanco", "1", "LEN>", "0", "Banco", "No se ha definido el banco.");
    this.val.add("cmbBodega", "1", "LEN>", "0", "Sucursal", "Seleccione una sucursal.");
    this.val.add("txtNoDoc", "1", "LEN>", "0", "No Doc", "No se ha definido el número de consecutivo.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Ingrese una fecha valida.");
    this.val.add("txtBeneficiario", "1", "LEN>", "0", "Fecha", "No se ha especificado el beneficiario del Cheque.");
    this.val.add("txtMoneda", "1", "LEN>", "0", "Fecha", "No se ha especificado la moneda de la cuenta.");
    this.val.add("TxtTC", "1", "DEC>", "0", "Fecha", "No se ha configurado el tipo de cambio.");
    this.val.add("txtConcepto", "1", "LEN>", "0", "Concepto", "Ingrese un concepto.");
    this.val.add("txtTotalCordoba", "1", "LEN>=", "0", "Total Cordoba", "");
    this.val.add("txtTotalDolar", "1", "LEN>=", "0", "Total Dolar", "");
    this.val.add("cmbCuentaC", "1", "LEN>", "0", "No Cuenta", "Seleccione una Cuenta Contable.");

    this.val.add("txtIrFuente", "1", "LEN>=", "0", "IR", "Ir en la fuente.")
    this.val.add("txtServP", "1", "LEN>=", "0", "SP", "Servicios Profecionales.")
    this.val.add("txtAlcaldias", "1", "LEN>=", "0", "Alcaldias", "Alcaldias")
    this.val.add("txtIva", "1", "LEN>=", "0", "IVA", "IVA.")
    this.val.add("txtTcCompraD", "1", "LEN>=", "0", "Compra Divisa", "Compra Divisa.")



  }

  public v_Evento(e: string): void {
    switch (e) {
      case "Iniciar":
        this.v_Evento("Limpiar");
        this.v_CargarDatos();
        break;

      case "Limpiar":

      this.FILA.IdCheque = "00000000-0000-0000-0000-000000000000";

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
        this.val.Get("cmbCuentaC").setValue("");

        this.val.Get("txtIrFuente").setValue("");
        this.val.Get("txtServP").setValue("");
        this.val.Get("txtAlcaldias").setValue("");
        this.val.Get("txtIva").setValue("");
        this.val.Get("txtTcCompraD").setValue("");



        this.val.Get("txtNombreCuenta").disable();
        this.val.Get("txtBanco").disable();
        this.val.Get("txtNoDoc").disable();
        this.val.Get("txtMoneda").disable();
        this.val.Get("TxtTC").disable();
        this.val.Get("txtTotalDolar").disable();
        this.val.Get("txtTotalCordoba").disable();



       // document.getElementById("btnContabilizar-Cheques")?.setAttribute("disabled", "disabled");




        if (this.lstBodega.length > 0) this.cmbBodega?.setSelectedItem(this.lstBodega[0].Codigo);


        this.V_TasaCambios();

        this.V_Agregar();


        break;
    }
  }



  @ViewChild("cmbCuentaBancaria", { static: false })
  public cmbCuentaBancaria: IgxComboComponent;

  public v_Select_CuentaBanco(event: any) {
    this.val.Get("cmbCuentaBancaria").setValue("");
    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      let _Item  = this.lstCuentabancaria.find(f => f.IdCuentaBanco == event.newValue[0]);

      this.val.Get("cmbCuentaBancaria").setValue([event.added]);
      this.val.Get("txtNombreCuenta").setValue(_Item?.NombreCuenta);
      this.val.Get("txtBanco").setValue(_Item?.Banco);
      this.val.Get("txtMoneda").setValue(_Item?.Moneda);
      this.val.Get("txtNoDoc").setValue(_Item?.Consecutivo);
      this.IdMoneda = String(_Item?.IdMoneda);

      //document.getElementById("btnContabilizar-Cheques")?.removeAttribute("disabled");

      this.val.Get("txtTotalDolar").setValue("0.00");
      this.val.Get("txtTotalCordoba").setValue("0.00");
      this.val.Get("txtIrFuente").setValue("");
      this.val.Get("txtServP").setValue("");
      this.val.Get("txtAlcaldias").setValue("");
      this.val.Get("txtIva").setValue("");
      this.val.Get("txtTcCompraD").setValue("");


      this.val.Get("txtTotalDolar").disable();
      this.val.Get("txtTotalCordoba").disable();
      this.val.Get("txtTotalDolar").setValue("0.00");
      this.val.Get("txtTotalCordoba").setValue("0.00");

      if (this.IdMoneda == this.cFunciones.MonedaLocal) {
        this.val.Get("txtTcCompraD").disable();
      }else{
        this.val.Get("txtTcCompraD").enable();
      }

    }
  }

  // public v_Enter_CuentaBanco(event: any) {

  //   if (event.key == "Enter") {
  //     let cmb : any = this.cmbCuentaBancaria.dropdown;
  //     let _Item: iCuentaBancaria = cmb._focusedItem.value;
  //     this.cmbCuentaBancaria.setSelectedItem(_Item.IdCuentaBanco);
  //     this.val.Get("cmbCuentaBancaria").setValue([_Item.IdCuentaBanco]);
  //   }
  // }

  public v_Enter_CuentaBanco(event: any) {
    if (event.key == "Enter") {
      let cmb : any = this.cmbCuentaBancaria.dropdown;
      let _Item: iCuentaBancaria = cmb._focusedItem.value;
      this.cmbCuentaBancaria.setSelectedItem(_Item.IdCuentaBanco);
      this.val.Get("cmbCuentaBancaria").setValue([_Item.IdCuentaBanco]);
    }
  }


  // let _Item: iCuenta = cmb._focusedItem.value;
  //     if(!txtCuenta.selection.includes(det.CuentaContable[0])) txtCuenta.setSelectedItem(_Item.CuentaContable);



  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  public v_Select_Bodega(event: any) {
   
    this.val.Get("cmbBodega").setValue("");
    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbBodega").setValue(event.newValue);
    }
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let cmb : any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem.value;
      this.cmbBodega.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbBodega").setValue([_Item.Codigo]);

    }
  }

 @ViewChild("cmbCuentaC", { static: false })
 public cmbCuentaC: IgxComboComponent;

 public v_Select_Cuenta2(event: any) {
  this.val.Get("cmbCuentaC").setValue("");
  if (event.added.length == 1) {  
    if(event.newValue.length > 1) event.newValue.splice(0, 1);
    let _Item  = this.lstCuenta.find(f => f.CuentaContable == event.newValue[0]);


   }
}

public v_Enter_Cuenta2(event: any) {
  if (event.key == "Enter") {
    let cmb : any = this.cmbCuentaC.dropdown;
    let _Item: iCuenta = cmb._focusedItem.value;
    this.cmbCuentaC.setSelectedItem(_Item.CuentaContable);
    this.val.Get("cmbCuentaC").setValue([_Item.CuentaContable]);

  }
}


  public v_Anulado(event: any): void {
    this.val.Get("chkAnulado").setValue(event.target.checked);
  }





  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

  public v_CargarDatos(): void {


    document.getElementById("btnRefrescar-Cheques")?.setAttribute("disabled", "disabled");

  
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


            if(this.cmbBodega.selection.length != 0)
            {
              let i_C = this.lstCuentabancaria.find(f => f.IdCuentaBanco == this.val.Get("cmbCuentaBancaria").value[0])
              this.val.Get("txtNombreCuenta").setValue(i_C?.NombreCuenta);
              this.val.Get("txtBanco").setValue(i_C?.Banco);
              this.val.Get("txtMoneda").setValue(i_C?.Moneda);
              this.val.Get("txtNoDoc").setValue(i_C?.Consecutivo);
              this.IdMoneda = String(i_C?.IdMoneda);
              this.V_Calcular();
            }


            this.V_TasaCambios();
            if(this.esModal) this.v_Visualizar();



          }

        },
        error: (err) => {


          document.getElementById("btnRefrescar-Cheque")?.removeAttribute("disabled");
          dialogRef.close();


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
    this.valTabla.Get("txtCuenta" + det.NoLinea).setValue("");
    
    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
   

      let txtCuenta: IgxComboComponent = event.owner


      let i_Cuenta: iCuenta = this.lstCuenta.find(f => f.CuentaContable == event.newValue[0])!;
   
      det.Descripcion = i_Cuenta.NombreCuenta.replaceAll(i_Cuenta.CuentaContable, "");
      det.Naturaleza = i_Cuenta.Naturaleza;

      document.getElementById("txtReferencia" + det.NoLinea)?.removeAttribute("disabled");
      document.getElementById("txtCentroCosto" + det.NoLinea)?.removeAttribute("disabled");
      document.getElementById("txtDebito" + det.NoLinea)?.setAttribute("disabled", "disabled");
      document.getElementById("txtCredito" + det.NoLinea)?.setAttribute("disabled", "disabled");

      if (i_Cuenta.Naturaleza == "D")
      {
        document.getElementById("txtDebito" + det.NoLinea)?.removeAttribute("disabled");
        if(Number(det.Credito.replaceAll(",", "")) != 0)
        {
          det.Debito = det.Credito;
          det.Credito = "0.00";
        }


        
      }

      if (i_Cuenta.Naturaleza == "C")
      {
        document.getElementById("txtCredito" + det.NoLinea)?.removeAttribute("disabled");
        if(Number(det.Debito.replaceAll(",", "")) != 0)
        {
          det.Credito  = det.Debito;
          det.Debito = "0.00";
        }
        
      }


    }

    this.V_Calcular();


  }
 

  public v_Enter_Cuenta(event: any, det: iAsientoDetalle) {

    if (event.key == "Enter") {
      let txtCuenta: any = this.cmbCuenta.find(f => f.id == "txtCuenta" + det.NoLinea);
      let cmb : any = txtCuenta.dropdown;

      let _Item: iCuenta = cmb._focusedItem.value;
      if(!txtCuenta.selection.includes(det.CuentaContable[0])) txtCuenta.setSelectedItem(_Item.CuentaContable);
      this.valTabla.Get("txtCuenta" + det.NoLinea).setValue([_Item.CuentaContable]);
      det.Descripcion = _Item.NombreCuenta.replaceAll(_Item.CuentaContable, "");;
      det.Naturaleza = _Item.Naturaleza;

      txtCuenta.close();

    }

  }
  // public v_FocusOut2(id: string): void {
  //   this.val.Get(id).setValue(this.cFunciones.NumFormat(this.val.Get(id).value.replaceAll(",", ""), "2"));
  // }

  public v_Select_CentroCosto(event: any, det: iAsientoDetalle): void {
 
    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      det.CentroCosto = event.newValue[0];
    }


  }
  public v_Enter_CentroCosto(event: any, det: iAsientoDetalle) {

    if (event.key == "Enter") {
      let txtCentro: any = this.cmbCombo.find(f => f.id == "txtCentroCosto" + det.NoLinea);

      let cmb : any = txtCentro.dropdown;

      let _Item: iCentroCosto = cmb._focusedItem.value;
      if(!txtCentro.selection.includes(det.CentroCosto)) txtCentro.setSelectedItem(_Item.Codigo);
      this.valTabla.Get("txtCentroCosto" + det.NoLinea).setValue([_Item.Codigo]);
      txtCentro.close();
    }

  }

  public V_FocusOut(det: iAsientoDetalle): void {


    det.Debito = this.cFunciones.NumFormat(Number(det.Debito.replaceAll(",", "")), "2");
    det.DebitoML = this.cFunciones.Redondeo(det.DebitoML, "2");
    det.DebitoMS = this.cFunciones.Redondeo(det.DebitoMS, "2");
    det.Credito = this.cFunciones.NumFormat(Number(det.Credito.replaceAll(",", "")), "2");
    det.CreditoML = this.cFunciones.Redondeo(det.CreditoML, "2");
    det.CreditoMS = this.cFunciones.Redondeo(det.CreditoMS, "2");

  }

  public V_Focus(columna: string, det: iAsientoDetalle) {

    if (columna != "NuevaFila") {
      if (columna != "Debito/Credito") {
        document?.getElementById("txt" + columna + det.NoLinea)?.focus();
      }
      else {
        if (det.Naturaleza == "D") document?.getElementById("txtDebito" + det.NoLinea)?.focus();
        if (det.Naturaleza == "C") document?.getElementById("txtCredito" + det.NoLinea)?.focus();

      }

    }
    else {

      let i: number = 1;

      if (this.lstDetalle.data.length > 0) i = Math.max(...this.lstDetalle.data.map(o => o.NoLinea))

      if (det.NoLinea != i) return;

      this.V_Agregar();
    }

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

    //if(this.cmbCuenta == undefined) return;

    let det: iAsientoDetalle = {} as iAsientoDetalle;
    let i: number = 1;

    if (this.lstDetalle.data.length > 0) i = Math.max(...this.lstDetalle.data.map(o => o.NoLinea)) + 1

    this.valTabla.add("txtCuenta" + i, "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
    this.valTabla.add("txtReferencia" + i, "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");




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
    this.lstDetalle.data.push(det);

    this.V_Ordenar(i);
  }

  V_Add(cuenta: string, Concepto: string, Valor: number, Tipo: string) {
    if(this.cmbCuenta == undefined) return;

    let det: iAsientoDetalle = {} as iAsientoDetalle;
    let i: number = 1;

    if (this.lstDetalle.data.length > 0) i = Math.max(...this.lstDetalle.data.map(o => o.NoLinea)) + 1

    this.valTabla.add("txtCuenta" + i, "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
    this.valTabla.add("txtReferencia" + i, "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");




    det.IdAsiento = -1;
    det.NoLinea = i;

    //det.Debito = "0";
    det.DebitoML = 0;
    det.DebitoMS = 0;
    //det.Credito = "0";
    det.CreditoML = 0;
    det.CreditoMS = 0;
    det.Modulo = "CON";
    det.Descripcion = "";

    this.lstDetalle.data.push(det);

    this.V_OrdenarCiclo2(i);


    setTimeout(() => {
      let txtCuenta: any = this.cmbCuenta.find(f => f.id == "txtCuenta" + i);

      if(!txtCuenta.selection.includes(cuenta)) txtCuenta.setSelectedItem(cuenta);
      det.Referencia = Concepto;
      if(Tipo == "D") {
        det.Debito = this.cFunciones.NumFormat(Number(Valor.toString()),"2");
        det.Credito = this.cFunciones.NumFormat(Number(0),"2");
      }
      if(Tipo == "C"){
        //this.suma += Number(Valor.toString());
        det.Credito = this.cFunciones.NumFormat(Number(Valor.toString()),"2");
        det.Debito =  this.cFunciones.NumFormat(Number(0),"2");
      }
    });

  }

  V_Eliminar(item: iAsientoDetalle) {
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
      document.getElementById("txtDebito" + x)?.setAttribute("disabled", "disabled");
      document.getElementById("txtCredito" + x)?.setAttribute("disabled", "disabled");

      let txtCuenta: any = this.cmbCuenta.find(f => f.id == "txtCuenta" + x);
      if (x > 1) txtCuenta.open();

      this.val.addFocus("txtCuenta" + x , "txtReferencia" + x, undefined);
      this.val.addFocus("txtReferencia" + x, "txtCentroCosto" + x, undefined);
      this.val.addFocus("txtCentroCosto" + x, "txtDebito" + x, undefined);
      this.val.addFocus("txtDebito" + x, "txtCredito" + x, undefined);



    }, 250);


  }

  private V_OrdenarCiclo(x: number) {

    this.lstDetalle.data = this.lstDetalle.data.sort((a, b) => a.NoLinea - b.NoLinea);

    this.lstDetalle.data = [...this.lstDetalle.data];

    this.V_Calcular();

    if (x == -1) return;




    setTimeout(() => {
      document?.getElementById("txtCuenta" + x)?.focus();
      document.getElementById("txtDescripcion" + x)?.setAttribute("disabled", "disabled");
      document.getElementById("txtDebito" + x)?.setAttribute("disabled", "disabled");
      document.getElementById("txtCredito" + x)?.setAttribute("disabled", "disabled");



      let txtCuenta: any = this.cmbCuenta.find(f => f.id == "txtCuenta" + x);


      if (x > 1) txtCuenta.open();




    }, 250);


  }

  private V_OrdenarCiclo2(x: number) {

    //this.lstDetalle.data = this.lstDetalle.data.sort((a, b) => a.NoLinea - b.NoLinea);

    this.lstDetalle.data = [...this.lstDetalle.data];



    if (x == -1) return;




    setTimeout(() => {
      document?.getElementById("txtCuenta" + x)?.focus();
      document.getElementById("txtDescripcion" + x)?.setAttribute("disabled", "disabled");
      document.getElementById("txtDebito" + x)?.setAttribute("disabled", "disabled");
      document.getElementById("txtCredito" + x)?.setAttribute("disabled", "disabled");



      let txtCuenta: any = this.cmbCuenta.find(f => f.id == "txtCuenta" + x);


      //if (x > 1) txtCuenta.open();
      this.V_Calcular();

    }, 250);


  }
  public V_Calcular(): void {

    this.dec_TotalDebe = 0;
    this.dec_TotalHaber = 0;
    this.dec_Dif = 0;

    this.lstDetalle.data.forEach(f => {

      let Debe = Number(String(f.Debito).replaceAll(",", ""));
      let Haber = Number(String(f.Credito).replaceAll(",", ""));

     // if (this.IdMoneda == "COR") {
        f.DebitoML = this.cFunciones.Redondeo(Debe, "2");
        f.DebitoMS = this.cFunciones.Redondeo(f.DebitoML / this.TC, "2");

        f.CreditoML = this.cFunciones.Redondeo(Haber, "2");
        f.CreditoMS = this.cFunciones.Redondeo(f.CreditoML / this.TC, "2");



      this.dec_TotalDebe += Debe;
      this.dec_TotalHaber += Haber;
    });

    this.dec_Dif = this.cFunciones.Redondeo(this.dec_TotalDebe - this.dec_TotalHaber, "2");

    let TotalCordoba : number = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoML), 0);
    let TotalDolar : number  = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoMS), 0);


    this.val.Get("txtTotalCordoba").setValue(this.cFunciones.NumFormat(TotalCordoba, "2"));
    this.val.Get("txtTotalDolar").setValue(this.cFunciones.NumFormat(TotalDolar, "2"));


  }

  

  public v_Guardar() : void{

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
    this.FILA.CuentaContable = this.val.Get("cmbCuentaC").value[0];
    this.FILA.CodBodega = this.val.Get("cmbBodega").value[0];
    //this.FILA.CentroCosto = this.val.Get("cmbCombo").value[0];
    this.FILA.IdSerie = "CK"
    this.FILA.NoCheque = this.val.Get("txtNoDoc").value;
    this.FILA.Fecha = this.val.Get("txtFecha").value;
    this.FILA.Beneficiario = this.val.Get("txtBeneficiario").value;
    this.FILA.TasaCambio = this.val.Get("TxtTC").value;
    this.FILA.Concepto = this.val.Get("txtConcepto").value;
    // this.FILA.Total = this.lstDetalle.data.reduce((acc, cur) => acc + Number(String(cur.Credito).replaceAll(",", "")), 0);
    // this.FILA.TotalCordoba = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoML), 0);
    // this.FILA.TotalDolar = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoMS), 0);
    this.FILA.Total = this.ValorCheque
    this.FILA.TotalCordoba = this.ValorCheque
    this.FILA.TotalDolar = this.cFunciones.Redondeo(Number(this.ValorCheque / this.TC),"2");
    this.FILA.UsuarioReg = this.cFunciones.User;
    if(!this.esModal) this.FILA.Anulado = false;
    this.FILA.TipoCheque = "C";



    let Asiento : iAsiento = {} as iAsiento;
    let CuentaBancaria = this.lstCuentabancaria.find(f=> f.IdCuentaBanco == this.FILA.IdCuentaBanco);


    Asiento.NoDocOrigen = this.FILA.NoCheque;
    Asiento.IdSerieDocOrigen = this.FILA.IdSerie;
    Asiento.TipoDocOrigen = "CHEQUE";

    Asiento.IdSerie = Asiento.IdSerieDocOrigen;
    if(!this.esModal) Asiento.NoAsiento = "";
    Asiento.Bodega = this.FILA.CodBodega;
    Asiento.Fecha = this.FILA.Fecha;
    Asiento.Referencia = this.FILA.Beneficiario;
    Asiento.Concepto = this.FILA.Concepto ;
    Asiento.IdMoneda = String(CuentaBancaria?.IdMoneda);
    Asiento.TasaCambio = this.val.Get("TxtTC").value;
    Asiento.AsientosContablesDetalle = JSON.parse(JSON.stringify(this.lstDetalle.data));
    Asiento.Total = this.lstDetalle.data.reduce((acc, cur) => acc + Number(String(cur.Credito).replaceAll(",", "")), 0);
    Asiento.TotalML = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoML), 0);
    Asiento.TotalMS = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoMS), 0);
    Asiento.UsuarioReg = this.FILA.UsuarioReg;
    Asiento.FechaReg = new Date();

    Asiento.AsientosContablesDetalle.forEach(f =>{
      f.CuentaContable = f.CuentaContable[0]      
      if(f.CentroCosto != undefined) f.CentroCosto = f.CentroCosto[0];
    });


    if (!this.esModal) {
      Asiento.IdPeriodo = 0;
      Asiento.Estado = "Solicitado";
      Asiento.TipoAsiento = "ASIENTO BASE"

    }


    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    document.getElementById("btnGuardar-Asiento")?.setAttribute("disabled", "disabled");


    let Datos : iChequePOST = {} as iChequePOST;
    Datos.C = this.FILA;
    Datos.A = Asiento;

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

  public HabiliarValor(event: any): void {

    if ( this.val.Get("txtMoneda").value == "Cordobas" ) {
      this.val.Get("txtTotalDolar").disable();
      this.val.Get("txtTotalCordoba").enable();
    }else {
      this.val.Get("txtTotalDolar").enable();
        this.val.Get("txtTotalCordoba").disable();
    }



  }


  public v_Contabilizar(): void{

    this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
    this.suma = 0.0;
    this.ret1 = 0.0;
    this.ret2 = 0.0;
    this.ret3 = 0.0;
    this.ValorC = 0.0;
    this.sumaDebito = 0.0;
    this.ValorCheque = 0.0;

    if ( this.IdMoneda == this.cFunciones.MonedaLocal) {

      if (Number(this.Valor) == 0 ) {
        this.val.add("txtTotalCordoba", "1", "NUM>", "0", "Total Cordoba", "Escriba el Valor en Córdobas");
        if(!this.val.ItemValido(["txtTotalCordoba"])) return;
      }
      this.Valor = Number(this.val.Get("txtTotalCordoba").value)
    } else {
      if (Number(this.Valor) == 0) {
        this.val.add("txtTotalDolar", "1", "NUM>", "0", "Total Dolar", "Escriba el Valor en Dolares");
        if(!this.val.ItemValido(["txtTotalDolar"])) return;

      }
      this.Valor = Number(this.val.Get("txtTotalDolar").value)
    }


    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }


     if(this.val.ItemValido(["cmbCuentaC"])) {
      let cuenta : iCuenta = this.cmbCuentaC.dropdown.focusedItem.value;
      if (this.val.Get("txtTcCompraD").value > 0) {
        this.ret1 = this.Valor / this.TC
        this.ret2 = this.Valor / Number(this.val.Get("txtTcCompraD").value)
        this.ret3 = Math.abs((this.ret2 - this.ret1) * this.TC)
      }
      if (this.IdMoneda == this.cFunciones.MonedaLocal) {
        this.V_Add(cuenta.CuentaContable, this.val.Get("txtConcepto").value,this.Valor - this.cFunciones.Redondeo(this.ret3, "2"),"D");        
      }else{
        this.ValorC = this.cFunciones.Redondeo((this.val.Get("txtConcepto").value,this.Valor * this.TC),"2") - this.cFunciones.Redondeo(this.ret3, "2");
        this.V_Add(cuenta.CuentaContable, this.val.Get("txtConcepto").value,this.ValorC,"D");       
      }
      
     }
      if (this.val.Get("txtIrFuente").value > 0 ) {
        if (this.IdMoneda == this.cFunciones.MonedaLocal) {
          this.V_Add("1142-03","Ret. " + this.val.Get("txtBeneficiario").value,this.Valor * (Number(this.val.Get("txtIrFuente").value)/100),"C");
          this.suma += this.Valor * (Number(this.val.Get("txtIrFuente").value)/100);
        }else{
          this.ValorC = this.cFunciones.Redondeo((this.Valor * this.TC ),"2") * this.cFunciones.Redondeo((Number(this.val.Get("txtIrFuente").value ) / 100),"2");
          this.V_Add("1142-03","Ret. " + this.val.Get("txtBeneficiario").value,this.ValorC,"C");
          this.suma += this.ValorC
        }
        
      }
      if (this.val.Get("txtServP").value > 0 ) {
        if (this.IdMoneda == this.cFunciones.MonedaLocal) {
          this.V_Add("1142-03","Ret. " + this.val.Get("txtBeneficiario").value,this.Valor * (Number(this.val.Get("txtServP").value)/100),"C");
        this.suma += this.Valor * (Number(this.val.Get("txtServP").value)/100)
        } else {
          this.ValorC = this.cFunciones.Redondeo((this.Valor * this.TC),"2") * this.cFunciones.Redondeo((Number(this.val.Get("txtServP").value)/100),"2")
          this.V_Add("1142-03","Ret. " + this.val.Get("txtBeneficiario").value,this.ValorC,"C");
          this.suma += this.ValorC;
        }
        
      }
      if (this.val.Get("txtAlcaldias").value > 0 ) {
        if (this.IdMoneda == this.cFunciones.MonedaLocal) {
          this.V_Add("1123-25","Ret. " + this.val.Get("txtBeneficiario").value,this.Valor * (Number(this.val.Get("txtAlcaldias").value)/100),"C");
          this.suma += this.Valor * (Number(this.val.Get("txtAlcaldias").value)/100)
        } else {
          this.ValorC = this.cFunciones.Redondeo((this.Valor * this.TC),"2") * this.cFunciones.Redondeo((Number(this.val.Get("txtAlcaldias").value)/100),"2")
          this.V_Add("1123-25","Ret. " + this.val.Get("txtBeneficiario").value,this.ValorC,"C");
          this.suma += this.ValorC
        }
       
      }
      if (this.val.Get("txtIva").value > 0 ) {
        if (this.IdMoneda == this.cFunciones.MonedaLocal) {
          this.V_Add("1142-05",this.val.Get("txtBeneficiario").value,this.Valor * (Number(this.val.Get("txtIva").value)/100),"D");
          this.sumaDebito = this.Valor * (Number(this.val.Get("txtIva").value)/100)
        } else {
          this.ValorC = this.cFunciones.Redondeo((this.Valor * this.TC),"2")  * this.cFunciones.Redondeo((Number(this.val.Get("txtIva").value)/100),"2")
          this.V_Add("1142-05",this.val.Get("txtBeneficiario").value,this.ValorC,"D");
          this.sumaDebito = this.ValorC 
        }
        
      }

      if(this.val.ItemValido(["cmbCuentaBancaria"])) {
        let item :iCuentaBancaria = this.cmbCuentaBancaria.dropdown.focusedItem.value;
        if (this.IdMoneda == this.cFunciones.MonedaLocal) {
          this.V_Add(item.CuentaBancaria,this.val.Get("txtNoDoc").value + " " + this.val.Get("txtBeneficiario").value,(this.Valor - this.suma) +  this.sumaDebito ,"C");
          this.ValorCheque = (this.Valor - this.suma) +  this.sumaDebito
        } else {
          this.ValorC = this.cFunciones.Redondeo((this.Valor * this.TC),"2")  - this.cFunciones.Redondeo(this.suma,"2") +  this.cFunciones.Redondeo(this.sumaDebito,"2")
          this.V_Add(item.CuentaBancaria,this.val.Get("txtNoDoc").value + " " + this.val.Get("txtBeneficiario").value,this.ValorC ,"C");
          this.ValorCheque = this.ValorC 
        }
        

       }
       if (this.val.Get("txtTcCompraD").value > 0) {

        this.ret1 = this.Valor / this.TC
        this.ret2 = this.Valor / Number(this.val.Get("txtTcCompraD").value)
        this.ret3 = Math.abs((this.ret2 - this.ret1) * this.TC)

        this.V_Add("6115-01",this.val.Get("txtBeneficiario").value,this.cFunciones.Redondeo(this.ret3 , "2"),"D");
        // this.sumaDebito = this.cFunciones.Redondeo(this.ret3,"2")
      }

  }

  private v_Visualizar()
  {


    this.cmbCuentaBancaria.setSelectedItem(this.FILA.IdCuentaBanco);
    this.cmbBodega.setSelectedItem(this.FILA.CodBodega);
    this.cmbCuentaC.setSelectedItem(this.FILA.CuentaContable)
    this.val.Get("txtNoDoc").setValue(this.FILA.NoCheque);
    this.val.Get("txtFecha").setValue( this.cFunciones.DateFormat(this.FILA.Fecha, "yyyy-MM-dd"));
    this.val.Get("txtBeneficiario").setValue(this.FILA.Beneficiario);
    this.val.Get("TxtTC").setValue(this.FILA.TasaCambio);
    this.val.Get("txtConcepto").setValue(this.FILA.Concepto);
    this.val.Get("txtTotalDolar").setValue(this.cFunciones.NumFormat(this.FILA.TotalDolar, "2"));
    this.val.Get("txtTotalCordoba").setValue(this.cFunciones.NumFormat(this.FILA.TotalCordoba, "2"));

    this.TC = this.FILA.TasaCambio;
    this.Anulado = this.FILA.Anulado;




   //let x: number = 1;
   

    setTimeout(() => {

      this.lstDetalle.data.forEach(f => {
        this.valTabla.add("txtCuenta" + f.NoLinea, "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
        this.valTabla.add("txtReferencia" + f.NoLinea, "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
        this.valTabla.add("txtCentroCosto" + f.NoLinea, "1", "LEN>", "0", "Centro Costo", "Seleccione un centro de costo.");

        f.Debito = this.cFunciones.NumFormat(Number(String(f.Debito).replaceAll(",", "")), "2");
        f.Credito = this.cFunciones.NumFormat(Number(String(f.Credito).replaceAll(",", "")), "2");
        
        let txtCuenta: any = this.cmbCuenta.find(y => y.id == "txtCuenta" + f.NoLinea);

        

        if(!txtCuenta.selection[0]?.CuentaContable.includes(f.CuentaContable[0])) txtCuenta.setSelectedItem(f.CuentaContable); 

        
        this.valTabla.Get("txtCuenta" + f.NoLinea).setValue(f.CuentaContable);
        this.valTabla.Get("txtReferencia" + f.NoLinea).setValue(f.Referencia);

        
        let txtCentro: any = this.cmbCombo.find(y => y.id == "txtCentroCosto" + f.NoLinea);
        if(!txtCentro.selection[0]?.Codigo.includes(f.CentroCosto[0])) txtCentro.setSelectedItem(f.CentroCosto);
       
  
        document.getElementById("txtCentroCosto" + f.NoLinea)?.setAttribute("disabled", "disabled");
        document.getElementById("txtDebito" + f.NoLinea)?.setAttribute("disabled", "disabled");
        document.getElementById("txtCredito" + f.NoLinea)?.setAttribute("disabled", "disabled");
  
        if (f.Naturaleza == "D") document.getElementById("txtDebito" + f.NoLinea)?.removeAttribute("disabled");
  
        if (f.Naturaleza == "C") document.getElementById("txtCredito" + f.NoLinea)?.removeAttribute("disabled");

      });
  


      let dialogRef : any = this.cFunciones.DIALOG.getDialogById("wait") ;
      if(dialogRef != undefined) dialogRef.close();
     
    });
  }
  

  ngOnInit(): void {

    this.v_Evento("Iniciar");
    this.overlaySettings = {};

    if (window.innerWidth <= 992) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }


    // let chk: any = document.querySelector("#chkAnulado");
    // if (chk != undefined) chk.bootstrapToggle();


  }

  ngDoCheck(){

    this.valTabla.Combo(this.cmbCombo);

    this.val.addNumberFocus("txtTotalCordoba", 2);
    this.val.addNumberFocus("txtTotalDolar", 2);

    let i : number = 0;
    this.lstDetalle.data.forEach(f => {
      this.val.addNumberFocus("txtDebito" + f.NoLinea, 2);
      this.val.addFocus("txtCredito" + f.NoLinea, "txtImporte" + (f.NoLinea + 1) , undefined);
      this.valTabla.addFocus("txtReferencia" + f.NoLinea, "txtCentroCosto" + f.NoLinea, undefined);
      i++;
    });


  }

}

