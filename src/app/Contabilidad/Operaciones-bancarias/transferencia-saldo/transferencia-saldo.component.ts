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
import { iAsiento } from 'src/app/Interface/Contabilidad/i-Asiento';
import { iTransferenciaCunta } from 'src/app/Interface/Contabilidad/i-Transferencia-cuenta';
import { postTrasnferencia } from '../CRUD/POST/post-Transferencia';
import { iTransferenciaCuentaPOST } from 'src/app/Interface/Contabilidad/I-transferencia-cuenta-POST';
import { iProveedor } from 'src/app/Interface/Proveedor/i-proveedor';

@Component({
  selector: 'app-transferencia-saldo',
  templateUrl: './transferencia-saldo.component.html',
  styleUrls: ['./transferencia-saldo.component.scss']
})
export class TransferenciaSaldoComponent {
  public overlaySettings: OverlaySettings = {};
  public val = new Validacion();
  public valTabla = new Validacion();

  private IdMoneda : string = "";

  lstProveedor: iProveedor[] = [];
  public lstCuentabancaria : iCuentaBancaria[] = [];
  lstBodega: iBodega[] = [];


  @ViewChildren(IgxComboComponent)
  public cmbCuenta: QueryList<IgxComboComponent>;
  
  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iAsientoDetalle>;


  public FILA: iTransferenciaCunta = {} as iTransferenciaCunta;


  public esModal: boolean = false;
  public TC: number;
  public Anulado : boolean = false;


  @ViewChildren(IgxComboComponent)
  public cmbCombo: QueryList<IgxComboComponent>;


  constructor(public cFunciones: Funciones, private GET: getTransferencia, private POST : postTrasnferencia) {

    this.val.add("cmbCuentaBancaria", "1", "LEN>", "0", "No Cuenta", "Seleccione una cuenta bancaria.");
    this.val.add("txtNombreCuenta", "1", "LEN>", "0", "Nombre Cuenta", "No se ha definido el nombre de la cuenta.");
    this.val.add("txtBanco", "1", "LEN>", "0", "Banco", "No se ha definido el banco.");
    this.val.add("cmbBodega", "1", "LEN>", "0", "Sucursal", "Seleccione una sucursal.");
    this.val.add("txtNoDoc", "1", "LEN>", "0", "No Doc", "No se ha definido el número de consecutivo.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Ingrese una fecha valida.");
    this.val.add("cmbProveedor", "1", "LEN>", "0", "Fecha", "Seleccione un proveedor.");
    this.val.add("txtMoneda", "1", "LEN>", "0", "Fecha", "No se ha especificado la moneda de la cuenta.");
    this.val.add("TxtTC", "1", "DEC>", "0", "Fecha", "No se ha configurado el tipo de cambio.");
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

      this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
      this.lstDetalle = new MatTableDataSource<iAsientoDetalle>;


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


        this.val.Get("txtNombreCuenta").disable();
        this.val.Get("txtBanco").disable();
        this.val.Get("txtNoDoc").disable();
        this.val.Get("txtMoneda").disable();
        this.val.Get("TxtTC").disable();
        this.val.Get("txtTotalDolar").disable();
        this.val.Get("txtTotalCordoba").disable();


        if (this.lstBodega.length > 0) this.cmbBodega?.setSelectedItem(this.lstBodega[0].Codigo);


        this.V_TasaCambios();

     

        break;
    }
  }


  
  @ViewChild("cmbCuentaBancaria", { static: false })
  public cmbCuentaBancaria: IgxComboComponent;

  public v_Select_CuentaBanco(event: any) {
    this.val.Get("cmbCuentaBancaria").setValue("");
    if (event.added.length == 1) {
      if(event.oldSelection[0] != event.added[0]) event.newSelection =   event.added;
      let _Item  = this.lstCuentabancaria.find(f => f.IdCuentaBanco == event.added);

      this.val.Get("cmbCuentaBancaria").setValue([event.added]);
      this.val.Get("txtNombreCuenta").setValue(_Item?.NombreCuenta);
      this.val.Get("txtBanco").setValue(_Item?.Banco);
      this.val.Get("txtMoneda").setValue(_Item?.Moneda);
      this.val.Get("txtNoDoc").setValue(_Item?.Consecutivo);
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
    this.val.Get("cmbBodega").setValue("");
    if (event.added.length == 1) {
      if(event.oldSelection[0] != event.added[0]) event.newSelection =   event.added;
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





  
  @ViewChild("cmbProveedor", { static: false })
  public cmbProveedor: IgxComboComponent;

  public v_Select_Proveedor(event: any) {

    if (event.added.length == 1) {
      if(event.oldSelection[0] != event.added[0]) event.newSelection =   event.added;
      let _Item  = this.lstProveedor.find(f => f.Codigo == event.added);

      this.val.Get("cmbProveedor").setValue([event.added]);

      
    }
  }

  public v_Enter_Proveedor(event: any) {
    if (event.key == "Enter") {
      let _Item: iProveedor = this.cmbProveedor.dropdown.focusedItem.value;
      this.cmbProveedor.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbProveedor").setValue([_Item.Codigo]);
    }
  }





  
  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

  public v_CargarDatos(): void {


    document.getElementById("btnRefrescar-Transferencia")?.setAttribute("disabled", "disabled");

  
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
            this.lstProveedor = datos[3].d;
        

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
  






  
  public V_Calcular(): void {



    this.lstDetalle.data.forEach(f => {

      
    });

    let TotalCordoba : number = 0//this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoML), 0);
    let TotalDolar : number  = 0//this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoMS), 0);


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




    this.FILA.IdCuentaBanco = this.val.Get("cmbCuentaBancaria").value[0];
    this.FILA.CodBodega = this.val.Get("cmbBodega").value[0];
    this.FILA.IdSerie = "TBan"
    this.FILA.NoTransferencia = this.val.Get("txtNoDoc").value;
    this.FILA.Fecha = this.val.Get("txtFecha").value;
    this.FILA.Beneficiario = this.val.Get("txtBeneficiario").value;
    this.FILA.TasaCambio = this.val.Get("TxtTC").value;
    this.FILA.Concepto = this.val.Get("txtConcepto").value;
    this.FILA.Total = this.lstDetalle.data.reduce((acc, cur) => acc + Number(String(cur.Credito).replaceAll(",", "")), 0);
    this.FILA.TotalCordoba = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoML), 0);
    this.FILA.TotalDolar = this.lstDetalle.data.reduce((acc, cur) => acc + Number(cur.CreditoMS), 0);
    this.FILA.UsuarioReg = this.cFunciones.User;
    if(!this.esModal) this.FILA.Anulado = false;
    this.FILA.TipoTransferencia = "C";



    let Asiento : iAsiento = {} as iAsiento;
    let CuentaBancaria = this.lstCuentabancaria.find(f=> f.IdCuentaBanco == this.FILA.IdCuentaBanco);


    Asiento.NoDocOrigen = this.FILA.NoTransferencia;
    Asiento.IdSerieDocOrigen = this.FILA.IdSerie;
    Asiento.TipoDocOrigen = "TRANSFERENCIA A CUENTA";

    Asiento.IdSerie = Asiento.IdSerieDocOrigen;
    Asiento.Bodega = this.FILA.CodBodega;
    Asiento.Fecha = this.FILA.Fecha;
    Asiento.Referencia = this.FILA.Beneficiario;
    Asiento.Concepto = this.FILA.Concepto ;
    Asiento.IdMoneda = String(CuentaBancaria?.IdMoneda);
    Asiento.TasaCambio = this.val.Get("TxtTC").value;
    Asiento.AsientosContablesDetalle = JSON.parse(JSON.stringify(this.lstDetalle.data));
    Asiento.Total = this.FILA.Total;
    Asiento.TotalML = this.FILA.TotalCordoba;
    Asiento.TotalMS = this.FILA.TotalDolar;
    Asiento.UsuarioReg = this.FILA.UsuarioReg;
    Asiento.FechaReg = new Date();
    Asiento.Estado = "";

    Asiento.AsientosContablesDetalle.forEach(f =>{
      f.CuentaContable = f.CuentaContable[0];
    });


    Asiento.IdPeriodo = 0;
    Asiento.Estado = "Solicitado";
    Asiento.TipoAsiento = "ASIENTO BASE";
    Asiento.NoAsiento = "";


    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    document.getElementById("btnGuardar-Asiento")?.setAttribute("disabled", "disabled");


    let Datos : iTransferenciaCuentaPOST = {} as iTransferenciaCuentaPOST;
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


  private v_Visualizar()
  {


    this.cmbCuentaBancaria.setSelectedItem(this.FILA.IdCuentaBanco);
    this.cmbBodega.setSelectedItem(this.FILA.CodBodega);
    this.val.Get("txtNoDoc").setValue(this.FILA.NoTransferencia);
    this.val.Get("txtFecha").setValue( this.cFunciones.DateFormat(this.FILA.Fecha, "yyyy-MM-dd"));
    this.val.Get("txtBeneficiario").setValue(this.FILA.Beneficiario);
    this.val.Get("TxtTC").setValue(this.FILA.TasaCambio);
    this.val.Get("txtConcepto").setValue(this.FILA.Concepto);
    this.val.Get("txtTotalDolar").setValue(this.cFunciones.NumFormat(this.FILA.TotalDolar, "2"));
    this.val.Get("txtTotalCordoba").setValue(this.cFunciones.NumFormat(this.FILA.TotalCordoba, "2"));

    this.TC = this.FILA.TasaCambio;
    this.Anulado = this.FILA.Anulado;




   let x: number = 1;
   

    
   let dialogRef : any = this.cFunciones.DIALOG.getDialogById("wait") ;
   if(dialogRef != undefined) dialogRef.close();

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
    this.val.addFocus("cmbBodega", "txtBeneficiario", undefined);
    this.val.addFocus("txtBeneficiario", "txtConcepto", undefined);


  }
}
