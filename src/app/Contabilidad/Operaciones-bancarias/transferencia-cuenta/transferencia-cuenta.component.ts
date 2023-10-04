import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings, scaleInCenter, scaleOutCenter } from 'igniteui-angular';
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

@Component({
  selector: 'app-transferencia-cuenta',
  templateUrl: './transferencia-cuenta.component.html',
  styleUrls: ['./transferencia-cuenta.component.scss']
})
export class TransferenciaCuentaComponent {
  public overlaySettings: OverlaySettings = {};
  public val = new Validacion();
  public valTabla = new Validacion();

  private IdMoneda : string = "";

  lstCuenta: iCuenta[] = [];
  public lstCuentabancaria : iCuentaBancaria[] = [];
  lstBodega: iBodega[] = [];


  @ViewChildren(IgxComboComponent)
  public cmbCuenta: QueryList<IgxComboComponent>;
  
  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iAsientoDetalle>;



  public esModal: boolean = false;
  public dec_TotalDebe: number = 0;
  public dec_TotalHaber: number = 0;
  public dec_Dif: number = 0;
  public TC: number;



  constructor(public cFunciones: Funciones, private GET: getTransferencia) {

    this.val.add("cmbCuentaBancaria", "1", "LEN>", "0", "No Cuenta", "Seleccione una serie.");
    this.val.add("txtNombreCuenta", "1", "LEN>", "0", "Nombre Cuenta", "No se ha definido el nombre de la cuenta.");
    this.val.add("txtBanco", "1", "LEN>", "0", "No Cuenta", "No se ha definido el banco.");
    this.val.add("cmbBodega", "1", "LEN>", "0", "Sucursal", "Seleccione una sucursal.");
    this.val.add("txtNoDoc", "1", "LEN>", "0", "No Doc", "No se ha definido el número de consecutivo.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Ingrese una fecha valida.");
    this.val.add("txtBeneficiario", "1", "LEN>", "0", "Fecha", "No se ha especificado el beneficiario de la transferencia.");
    this.val.add("txtMoneda", "1", "LEN>", "0", "Fecha", "No se ha especificado la moneda de la cuenta.");
    this.val.add("TxtTC", "1", "DEC>", "0", "Fecha", "No se ha configurado el tipo de cambio.");
    this.val.add("txtConcepto", "1", "LEN>", "0", "Concepto", "Ingrese un concepto.");
    this.val.add("chkAnulado", "1", "LEN>", "0", "Anulado", "");


    this.v_Evento("Iniciar");

  }



  
  public v_Evento(e: string): void {
    switch (e) {
      case "Iniciar":
        this.v_Evento("Limpiar");
        this.v_CargarDatos();
        break;

      case "Limpiar":

       
        this.val.Get("cmbCuentaBancaria").setValue();
        this.val.Get("txtNombreCuenta").setValue("");
        this.val.Get("txtBanco").setValue("");
        this.val.Get("cmbBodega").setValue("");
        this.val.Get("txtNoDoc").setValue("");
        this.val.Get("txtFecha").setValue(this.cFunciones.ShortFechaServidor());
        this.val.Get("txtBeneficiario").setValue("");
        this.val.Get("txtMoneda").setValue("");
        this.val.Get("txtConcepto").setValue("");
        this.val.Get("chkAnulado").setValue(false);


        this.val.Get("txtNombreCuenta").disable();
        this.val.Get("txtBanco").disable();
        this.val.Get("txtNoDoc").disable();
        this.val.Get("txtMoneda").disable();
        this.val.Get("TxtTC").disable();

        let chk: any = document.querySelector("#chkAnulado");
        if (chk != undefined) chk.bootstrapToggle("off");


        if (this.lstBodega.length > 0) this.cmbBodega?.setSelectedItem(this.lstBodega[0].Codigo);


        this.V_TasaCambios();

        this.V_Agregar();


        break;
    }
  }


  
  @ViewChild("cmbCuentaBancaria", { static: false })
  public cmbCuentaBancaria: IgxComboComponent;

  public v_Select_CuentaBanco(event: any) {
    if (event.added.length) {
      event.newSelection = event.added;
      let _Item  = this.lstCuentabancaria.find(f => f.IdCuentaBanco == event.added);

      this.val.Get("cmbCuentaBancaria").setValue([event.added]);
      this.val.Get("txtNombreCuenta").setValue(_Item?.NombreCuenta);
      this.val.Get("txtBanco").setValue(_Item?.Banco);
      this.val.Get("txtMoneda").setValue(_Item?.Moneda);
      this.val.Get("txtNoDoc").setValue(_Item?.ConsecutivoTransferencia);
      this.IdMoneda = String(_Item?.IdMoneda);
      
    }
  }

  public v_Enter_CuentaBanco(event: any) {
    if (event.key == "Enter") {
      let _Item: iCuentaBancaria = this.cmbCuentaBancaria.dropdown.focusedItem.value;
      this.cmbCuentaBancaria.setSelectedItem(_Item.IdCuentaBanco);
      this.val.Get("cmbCuentaBancaria").setValue([_Item.IdCuentaBanco]);
    }
  }





  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  public v_Select_Bodega(event: any) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.val.Get("cmbBodega").setValue([event.added]);
    }
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let _Item: iBodega = this.cmbBodega.dropdown.focusedItem.value;
      this.cmbBodega.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbBodega").setValue([_Item.Codigo]);

    }
  }



  public v_Anulado(event: any): void {
    this.val.Get("chkAnulado").setValue(event.target.checked);
  }




  
  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

  public v_CargarDatos(): void {


    document.getElementById("btnRefrescar-Transferencia")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );




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
        

            if (this.cmbBodega.selection.length == 0) this.cmbBodega.setSelectedItem(this.lstBodega[0]?.Codigo);


            if(this.cmbBodega.selection.length != 0)
            {
              let i_C = this.lstCuentabancaria.find(f => f.IdCuentaBanco == this.val.Get("cmbCuentaBancaria").value[0])
              this.val.Get("txtNombreCuenta").setValue(i_C?.NombreCuenta);
              this.val.Get("txtBanco").setValue(i_C?.Banco);
              this.val.Get("txtMoneda").setValue(i_C?.Moneda);
              this.val.Get("txtNoDoc").setValue(i_C?.ConsecutivoTransferencia);
              this.IdMoneda = String(i_C?.IdMoneda);
              this.V_Calcular();
            }
            


            this.V_TasaCambios();
            if(this.esModal) this.v_Visualizar();


          }

        },
        error: (err) => {


          document.getElementById("btnRefrescar-Transferencia")?.removeAttribute("disabled");
          dialogRef.close();


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

    if (event.added.length) {
      event.newSelection = event.added;

      let txtCuenta: IgxComboComponent = event.owner


      let i_Cuenta: iCuenta = this.lstCuenta.find(f => f.CuentaContable == event.added)!;
   
      det.Descripcion = i_Cuenta.NombreCuenta.replaceAll(i_Cuenta.CuentaContable, "");
      det.Naturaleza = i_Cuenta.Naturaleza;

      document.getElementById("txtDebito" + det.NoLinea)?.setAttribute("disabled", "disabled");
      document.getElementById("txtCredito" + det.NoLinea)?.setAttribute("disabled", "disabled");

      if (i_Cuenta.Naturaleza == "D") document.getElementById("txtDebito" + det.NoLinea)?.removeAttribute("disabled");

      if (i_Cuenta.Naturaleza == "C") document.getElementById("txtCredito" + det.NoLinea)?.removeAttribute("disabled");

    }



  }

  public v_Enter_Cuenta(event: any, det: iAsientoDetalle) {

    if (event.key == "Enter") {
      let txtCuenta: any = this.cmbCuenta.find(f => f.id == "txtCuenta" + det.NoLinea);

      let _Item: iCuenta = txtCuenta.dropdown.focusedItem.value;
      txtCuenta.setSelectedItem(_Item.CuentaContable);
      this.valTabla.Get("txtCuenta" + det.NoLinea).setValue([_Item.CuentaContable]);
      det.Descripcion = _Item.NombreCuenta.replaceAll(_Item.CuentaContable, "");;
      det.Naturaleza = _Item.Naturaleza;

      txtCuenta.close();
      this.V_Focus("Referencia", det);
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

    let det: iAsientoDetalle = {} as iAsientoDetalle;
    let i: number = 1;

    if (this.lstDetalle.data.length > 0) i = Math.max(...this.lstDetalle.data.map(o => o.NoLinea)) + 1

    this.valTabla.add("txtCuenta" + i, "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
    this.valTabla.add("txtReferencia" + i, "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");

    det.IdAsiento = -1;
   // det.IdTransferencia = this.FILA.IdTransferencia;
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

  V_Eliminar(item: iAsientoDetalle) {
    let i = this.lstDetalle.data.findIndex(f => f.NoLinea == item.NoLinea);

    if (i == -1) return;

    this.lstDetalle.data.splice(i, 1);
    this.V_Ordenar(-1);

    this.valTabla.del("txtCuenta" + item.NoLinea);
    this.valTabla.del("txtReferencia" + item.NoLinea);


  }

  private V_Ordenar(x: number) {

    this.lstDetalle.data = this.lstDetalle.data.sort((a, b) => b.NoLinea - a.NoLinea);

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




  
  public V_Calcular(): void {

    this.dec_TotalDebe = 0;
    this.dec_TotalHaber = 0;
    this.dec_Dif = 0;

    this.lstDetalle.data.forEach(f => {

      let Debe = Number(String(f.Debito).replaceAll(",", ""));
      let Haber = Number(String(f.Credito).replaceAll(",", ""));

      if (this.IdMoneda == "COR") {
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



  public v_Guardar() : void{

  }


  private v_Visualizar()
  {

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


    let chk: any = document.querySelector("#chkAnulado");
    if (chk != undefined) chk.bootstrapToggle();


    
  }
}
