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
import { getCheques } from '../CRUD/GET/get-Cheques';
import { Observable, catchError, iif, map, startWith, tap } from 'rxjs';
import { ideaGeneration } from '@igniteui/material-icons-extended';
import { iCheque } from '../../../Interface/Contabilidad/i-Cheque';
import { iChequePOST } from '../../../Interface/Contabilidad/i-Cheque-POST';
import { postCheque } from '../CRUD/POST/post-Cheque';
import { iCentroCosto } from '../../../Interface/Contabilidad/i-Centro-Costo';
import { IReembolsos } from 'src/app/Interface/Contabilidad/i-Reembolsos';
import { PDFDocument } from 'pdf-lib';
import * as printJS from 'print-js';
import { iProveedor } from 'src/app/Interface/Proveedor/i-proveedor';
import { IReembolsosD } from 'src/app/Interface/Contabilidad/i-ReembolsoD';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { getReporteContable } from 'src/app/Reporte/GET/get-Reporte-Contable';

@Component({
    selector: 'app-nuevo-cheque',
    templateUrl: './nuevo-cheque.component.html',
    styleUrls: ['./nuevo-cheque.component.scss'],
    standalone: false
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
  private IR : number = 0.0;
  private Alcaldia : number = 0.0;
  private SP : number = 0.0;
  private IVA : number = 0.0;
  private CompraD : number = 0.0;
  private Test : any;
  private ValorD : number = 0.0;

  texto: string = '';

  lstCuenta: iCuenta[] = [];
  public lstCuentabancaria : iCuentaBancaria[] = [];
  lstBodega: iBodega[] = [];
  lstCentroCosto: iCentroCosto[] = [];  
  lstReembolsos: IReembolsos[] = [];
  lstReembolsoD = new MatTableDataSource<IReembolsosD>;

  @ViewChildren(IgxComboComponent)
  public cmbCuenta: QueryList<IgxComboComponent>;

  @ViewChildren(IgxComboComponent) //esta variable es una vista para este componente
  public cmbCombo: QueryList<IgxComboComponent>;

//   @ViewChildren(IgxComboComponent)
//  public cmbReembolsoC: IgxComboComponent;

 
  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iAsientoDetalle>;


  public FILA: iCheque = {} as iCheque;

  filteredCuenta: Observable<iCuenta[]> | undefined;

  public esModal: boolean = false;
  public Editar: boolean = true;
  public dec_TotalDebe: number = 0;
  public dec_TotalHaber: number = 0;
  public dec_Dif: number = 0; 
  public TC: number;
  public SumValor: number = 0;
  public SumIVA: number = 0;
  public Anulado : boolean = false;
  private Visualizando : boolean = false;

  @ViewChild("datepiker", { static: false }) 
  public datepiker: any;

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
    this.val.add("cmbReembolsoC", "1", "LEN>=", "0", "No Reembolso", "Seleccione un Reembolso.");
    this.val.add("txtIrFuente", "1", "LEN>=", "0", "IR", "Ir en la fuente.")
    this.val.add("txtServP", "1", "LEN>=", "0", "SP", "Servicios Profecionales.")
    this.val.add("txtAlcaldias", "1", "LEN>=", "0", "Alcaldias", "Alcaldias")
    this.val.add("txtIva", "1", "LEN>=", "0", "IVA", "IVA.")
    this.val.add("txtTcCompraD", "1", "LEN>=", "0", "Compra Divisa", "Compra Divisa.")

    this.v_Evento("Iniciar");

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
      this.SumValor = 0;
      this.SumIVA = 0;


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
        this.val.Get("cmbReembolsoC").setValue("");
       

        this.val.Get("txtIrFuente").setValue("");
        this.val.Get("txtServP").setValue("");
        this.val.Get("txtAlcaldias").setValue("");
        this.val.Get("txtIva").setValue("");
        this.val.Get("txtTcCompraD").setValue("");



        this.val.Get("txtNombreCuenta").disable();
        this.val.Get("txtBanco").disable();
        this.val.Get("txtNoDoc").disable();
        this.val.Get("txtMoneda").disable();
        //this.val.Get("TxtTC").disable();
        this.val.Get("txtTotalDolar").disable();
        this.val.Get("txtTotalCordoba").disable();
        
        
        document.getElementById("btnContabilizar-Cheques")?.setAttribute("disabled", "disabled");

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

      this.val.Get("cmbCuentaBancaria").setValue([event.added]);
      this.val.Get("txtNombreCuenta").setValue(_Item?.NombreCuenta);
      this.val.Get("txtBanco").setValue(_Item?.Banco);
      this.val.Get("txtMoneda").setValue(_Item?.Moneda);
      this.val.Get("txtNoDoc").setValue(_Item?.Consecutivo);
      this.IdMoneda = String(_Item?.IdMoneda);
      this.val.Get("txtTotalDolar").disable();
      this.val.Get("txtTotalCordoba").disable();

      this.val.Get("txtIrFuente").setValue("");
      this.val.Get("txtServP").setValue("");
      this.val.Get("txtAlcaldias").setValue("");
      this.val.Get("txtIva").setValue("");
      this.val.Get("txtTcCompraD").setValue("");

      
     

      let i: number = this.V_Agregar(true);


      setTimeout(() => {
       
        let txtCuenta: any = this.cmbCuenta.find(y => y.id == "txtCuenta" + i);        
        
        txtCuenta.setSelectedItem((this.IdMoneda == this.cFunciones.MonedaLocal ? _Item?.CuentaNuevaC : _Item?.CuentaNuevaD));
        let det = this.lstDetalle.data.find(y => y.NoLinea == i);
          det!.Referencia = this.val.Get("txtNoDoc").value + ' ' + this.val.Get("txtBeneficiario").value;         
          
         
      }, 250);

      this.cmbCuentaBancaria.close();

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
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbBodega").setValue(event.newValue);
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbBodega.close();
      this.cmbBodega.close();
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

    if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbCuentaC.close();
    this.cmbCuentaC.close();
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

@ViewChild("cmbReembolsoC", { static: false })
public cmbReembolsoC: IgxComboComponent;


public v_Select_Reembolso(event: any) {

  let detBanco : iAsientoDetalle = this.lstDetalle.data.find(f => f.NoLinea == 1)!;
  this.val.Get("cmbReembolsoC").setValue("");
  if (event.added.length == 1) {
    if(event.newValue.length > 1) event.newValue.splice(0, 1);
    let _Item  = this.lstReembolsos.find(f => f.key == event.newValue[0]);

    if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbReembolsoC.close();

    if(this.Visualizando ) return;
  
    let detBanco : iAsientoDetalle = this.lstDetalle.data.find(f => f.NoLinea == 1)!;

    this.lstDetalle.data.forEach(f =>{

      this.valTabla.del("txtCuenta" + f.NoLinea);
      this.valTabla.del("txtReferencia" + f.NoLinea);
      this.valTabla.del("txtCentroCosto" + f.NoLinea);
      this.valTabla.del("txtDebito" + f.NoLinea);
      this.valTabla.del("txtCredito" + f.NoLinea);

    });

    this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
    this.valTabla = new Validacion();
    this.valTabla.add("txtCuenta1", "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
    this.valTabla.add("txtReferencia1", "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
    this.valTabla.add("txtCentroCosto1", "1", "LEN>=", "0", "Centro Costo", "Seleccione un centro de costo.");


    this.lstDetalle.data.push(detBanco);

    this.lstDetalle._updateChangeSubscription();


 


    setTimeout(() => {        
      this.SumIVA = 0;
      _Item?.DetalleCaja.forEach(f => {
        let i : number  = this.V_Agregar(false);
        let det = this.lstDetalle.data.find(y => y.NoLinea == i);
        det!.CuentaContable = [f.Cuenta];
        det!.CentroCosto = [f.CentroCosto];
        det!.Referencia =  String(f.Referencia);
        det!.Debito = this.cFunciones.NumFormat(f.SubTotal, "2");
        det!.Naturaleza = "D";
        this.SumValor += f.Total;
        this.SumIVA += f.Iva;
        detBanco!.Credito = this.cFunciones.NumFormat(this.SumValor, "2");

        this.valTabla.Get( "txtCuenta" + i).setValue([f.Cuenta]);
       this.valTabla.Get( "txtCentroCosto" + i).setValue([f.CentroCosto]);


       this.V_Calcular();
   
     })

     if (this.SumIVA > 0) {
      let i : number  = this.V_Agregar(false);
        let det = this.lstDetalle.data.find(y => y.NoLinea == i);
        det!.CuentaContable = ['2102-01-01-01'];
        det!.CentroCosto = "";
        det!.Referencia =  "IVA";
        det!.Debito = this.cFunciones.NumFormat(this.SumIVA, "2");
        det!.Naturaleza = "D";

        this.valTabla.Get( "txtCuenta" + i).setValue(['2102-01-01-01']);
        this.valTabla.Get( "txtCentroCosto" + i).setValue("");
        this.V_Calcular();
    }
     
    });




    
   }
   else{

    if(this.Visualizando ) return;

    detBanco.Debito = "0";
    detBanco.Credito = "0";

    let det : iAsientoDetalle = this.lstDetalle.data.find(f => f.NoLinea == 1)!;

    this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
    this.valTabla = new Validacion();
    this.valTabla.add("txtCuenta1", "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
    this.valTabla.add("txtReferencia1", "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
    this.valTabla.add("txtCentroCosto1", "1", "LEN>=", "0", "Centro Costo", "Seleccione un centro de costo.");


    this.lstDetalle.data.push(det);

    this.lstDetalle._updateChangeSubscription();

   }
}

public v_Enter_Reembolso(event: any) {
  if(this.Visualizando ) return;
  if (event.key == "Enter") {
    let cmb : any = this.cmbReembolsoC.dropdown;
    let _Item: IReembolsos = cmb._focusedItem.value;    
     
    this.cmbReembolsoC.setSelectedItem(_Item.Cuenta);
    this.val.Get("cmbReembolsoC").setValue([_Item.Cuenta]);
  
  }
}




  public v_Anulado(event: any): void {
    this.val.Get("chkAnulado").setValue(event.target.checked);
  }

  



  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

  public v_CargarDatos(): void {


    document.getElementById("btnRefrescar-Cheques")?.setAttribute("disabled", "disabled");
    document.getElementById("btnContabilizar-Cheques")?.setAttribute("disabled", "disabled");

  
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
            this.lstCuentabancaria = datos[0].d;
            this.lstBodega = datos[1].d;
            this.lstCuenta = datos[2].d.filter((f: any) => f.ClaseCuenta == "D");
            this.lstCentroCosto = datos[3].d;            
            this.lstReembolsos = datos[5].d;


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

  public SetDt(): void {

    // let i: number = this.V_Agregar(true);


    // setTimeout(() => {
     
    //   let txtCuenta: any = this.cmbCuenta.find(y => y.id == "txtCuenta" + i); 
      
    //   let det = this.lstDetalle.data.find(y => y.NoLinea == i);
    //   let Doc = this.val.Get("txtNoDoc").value;
    //   det!.Referencia = Doc == undefined ? this.val.Get("txtBeneficiario").value : this.val.Get("txtNoDoc").value  + ' ' + this.val.Get("txtBeneficiario").value ;         
       
    // }, 250);

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


      det.Descripcion = i_Cuenta?.NombreCuenta.replaceAll(i_Cuenta.CuentaContable, "");
      det.Naturaleza = i_Cuenta?.Naturaleza;

      document.getElementById("txtReferencia" + det.NoLinea)?.removeAttribute("disabled");
      document.getElementById("txtCentroCosto" + det.NoLinea)?.removeAttribute("disabled");



      txtCuenta.close();

    }

    //this.V_Calcular();
    

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
  // public v_FocusOut2(id: string): void {
  //   this.val.Get(id).setValue(this.cFunciones.NumFormat(this.val.Get(id).value.replaceAll(",", ""), "2"));
  // }

  public v_Select_CentroCosto(event: any, det: iAsientoDetalle): void {

    if (event.added.length == 1) {
      let txtCentro: any = this.cmbCombo.find(f => f.id == "txtCentroCosto" + det.NoLinea);

      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      det.CentroCosto = event.newValue[0];

      txtCentro.close();

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

      this.V_Agregar(false);
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

  V_Add(cuenta: string, Concepto: string, CC: string, Valor: number, Tipo: string) {
    if(this.cmbCuenta == undefined) return;

    let det: iAsientoDetalle = {} as iAsientoDetalle;
    let i: number = 1;

    if (this.lstDetalle.data.length > 0) i = Math.max(...this.lstDetalle.data.map(o => o.NoLinea)) + 1

    this.valTabla.add("txtCuenta" + i, "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
    this.valTabla.add("txtReferencia" + i, "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
    this.valTabla.add("txtCentroCosto" + i, "1", "LEN>=", "0", "Centro Costo", "Seleccione un centro de costo.");

   

    det.IdAsiento = -1;
    det.NoLinea = i;
    det.CuentaContable = "";

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
      this.valTabla.Get("txtCuenta" + i).setValue([cuenta]);

      if(!txtCuenta.selection.includes(cuenta)) txtCuenta.setSelectedItem(cuenta);
      det.Referencia = Concepto;
      det.CentroCosto = [CC];
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

      let txtCuenta: any = this.cmbCuenta.find(f => f.id == "txtCuenta" + x);
      if (x > 2) txtCuenta.open();

      this.val.addFocus("txtCuenta" + x, "txtReferencia" + x, undefined);
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



      // let txtCuenta: any = this.cmbCuenta.find(f => f.id == "txtCuenta" + x);
      // if (x > 1) txtCuenta.open();

      this.val.addFocus("txtCuenta" + x , "txtReferencia" + x, undefined);
      this.val.addFocus("txtReferencia" + x, "txtCentroCosto" + x, undefined);
      this.val.addFocus("txtCentroCosto" + x, "txtDebito" + x, undefined);
      this.val.addFocus("txtDebito" + x, "txtCredito" + x, undefined);




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
      document.getElementById("txtCentroCosto" + x)?.setAttribute("disabled", "disabled");


      // let txtCuenta: any = this.cmbCuenta.find(f => f.id == "txtCuenta" + x);
      // if (x > 1) txtCuenta.open();

      this.val.addFocus("txtCuenta" + x , "txtReferencia" + x, undefined);
      this.val.addFocus("txtReferencia" + x, "txtCentroCosto" + x, undefined);
      this.val.addFocus("txtCentroCosto" + x, "txtDebito" + x, undefined);
      this.val.addFocus("txtDebito" + x, "txtCredito" + x, undefined);


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
    
    //this.val.Combo(this.cmbCombo);

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
    this.FILA.CuentaIngCaja = this.val.Get("cmbReembolsoC").value[0];
    this.FILA.CodBodega = this.val.Get("cmbBodega").value[0];
    this.FILA.IdMoneda = this.IdMoneda;
    //this.FILA.CentroCosto = this.val.Get("cmbCombo").value[0];
    this.FILA.IdSerie = "CK"
    this.FILA.NoCheque = this.val.Get("txtNoDoc").value;
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
    this.FILA.ValorCheque = this.ValorCheque;
    this.FILA.UsuarioReg = this.cFunciones.User;    
    if(!this.esModal) this.FILA.Anulado = false;
    this.FILA.TipoCheque = "C";

    
    if (this.cmbReembolsoC.selection.length != 0) {
      let i_C = this.lstReembolsos.find(f => f.NombreCuenta == this.val.Get("cmbReembolsoC").value[0])
      let id = i_C?.IdIngresoCajaChica;
      this.FILA.IdIngresoCaja = id;
      this.FILA.CuentaIngCaja = i_C?.Cuenta!;      
    }
    else {
      this.FILA.IdIngresoCaja = 0;
      this.FILA.CuentaIngCaja = "0";
    }



    let Asiento : iAsiento = {} as iAsiento;
    let CuentaBancaria = this.lstCuentabancaria.find(f=> f.IdCuentaBanco == this.FILA.IdCuentaBanco);


    Asiento.NoDocOrigen = this.FILA.NoCheque;
    Asiento.IdSerieDocOrigen = this.FILA.IdSerie;
    Asiento.TipoDocOrigen = "CHEQUE A CUENTA";

    Asiento.IdSerie = Asiento.IdSerieDocOrigen;
    //if(!this.esModal) Asiento.NoAsiento = "";
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

    Asiento.AsientosContablesDetalle.forEach(f => {
      f.CuentaContable = f.CuentaContable[0];
      if (f.CentroCosto != undefined) f.CentroCosto = f.CentroCosto[0];
    });


    //if (!this.esModal) {
      Asiento.IdPeriodo = 0;
      Asiento.Estado = "AUTORIZADO";
      Asiento.TipoAsiento = "ASIENTO BASE"
      Asiento.NoAsiento = "";
    //}


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
            let msj: string = Datos[1].d;

            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              data: "<p><b class='bold'>" + msj + "</b></p>" 
            });


            if (!this.esModal){
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


  public ValValor(event: any): void {
    const nuevoValor = event.target.value;
    if (this.val.Get("txtIrFuente").value == null) this.val.Get("txtIrFuente").value = ''
    if (this.val.Get("txtServP").value == null) this.val.Get("txtServP").value = ''
    if (this.val.Get("txtAlcaldias").value == null) this.val.Get("txtAlcaldias").value = ''
    if (this.val.Get("txtIva").value == null) this.val.Get("txtIva").value = ''
    if (this.val.Get("txtTcCompraD").value == null) this.val.Get("txtTcCompraD").value = ''

    if (this.val.Get("txtIrFuente").value == '' && this.val.Get("txtServP").value == '' && this.val.Get("txtAlcaldias").value == '' && this.val.Get("txtIva").value == '' && this.val.Get("txtTcCompraD").value == '') {
      document.getElementById("btnContabilizar-Cheques")?.setAttribute("disabled","disabled");
      this.val.Get("txtTotalDolar").disable();
      this.val.Get("txtTotalCordoba").disable();
    }
    else
    {
      document.getElementById("btnContabilizar-Cheques")?.removeAttribute("disabled");
    }
    if ( this.val.Get("txtMoneda").value == "Cordobas" ) {
      this.val.Get("txtTotalDolar").disable();
      this.val.Get("txtTotalCordoba").enable();
    }else {
      this.val.Get("txtTotalDolar").enable();
        this.val.Get("txtTotalCordoba").disable();
    }
  }


  
  
  public v_Contabilizar(): void{    

    let detBanco : iAsientoDetalle = this.lstDetalle.data.find(f => f.NoLinea == 1)!;
    
    this.lstDetalle.data.forEach(f =>{

      this.valTabla.del("txtCuenta" + f.NoLinea);
      this.valTabla.del("txtReferencia" + f.NoLinea);
      this.valTabla.del("txtCentroCosto" + f.NoLinea);
      this.valTabla.del("txtDebito" + f.NoLinea);
      this.valTabla.del("txtCredito" + f.NoLinea);

    });

    this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
      this.valTabla = new Validacion();
      this.valTabla.add("txtCuenta1", "1", "LEN>", "0", "Cuenta", "Seleccione un numero de cuenta.");
      this.valTabla.add("txtReferencia1", "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
      this.valTabla.add("txtCentroCosto1", "1", "LEN>=", "0", "Centro Costo", "Seleccione un centro de costo.");


      this.lstDetalle.data.push(detBanco);

      this.lstDetalle._updateChangeSubscription();
  
    
    this.suma = 0.0;
    this.ret1 = 0.0;
    this.ret2 = 0.0;
    this.ret3 = 0.0;
    this.ValorC = 0.0;
    this.sumaDebito = 0.0;
    this.IR = 0.0;
    this.Alcaldia = 0.0;
    this.SP = 0.0;
    this.IVA = 0.0;
    this.CompraD = 0.0;
    this.Alcaldia = 0.0;
    this.SP = 0.0;
    this.IVA = 0.0;
    this.CompraD= 0.0;

  
    

    if ( this.IdMoneda == this.cFunciones.MonedaLocal) {
      
      //this.Test = this.val.Get("txtTotalCordoba").value;
      this.Valor = Number(String(this.val.Get("txtTotalCordoba").value).replaceAll(",", ""));
      if (Number(this.Valor) == 0 ) {
        this.val.replace("txtTotalCordoba", "1", "NUM>", "0", "Total Cordoba");    
         if(!this.val.ItemValido(["txtTotalCordoba"])) return;
      } 
        } else {
      this.Valor = Number(String(this.val.Get("txtTotalDolar").value).replaceAll(",", ""));
      if ( this.Valor == 0) {
        this.val.replace("txtTotalDolar", "1", "NUM>", "0", "Total Dolares"); 
         if(!this.val.ItemValido(["txtTotalDolar"])) return;

      }
      
    }

    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }


     if(this.val.ItemValido(["cmbCuentaC"])) {
      let cuenta : iCuenta = this.cmbCuentaC.dropdown.focusedItem.value;
      this.ValorD =  Number(String(this.val.Get("txtTcCompraD").value).replaceAll(",", ""));
      if (this.ValorD > 0) {
        this.ret1 = this.Valor / this.TC
        this.ret2 = this.Valor / Number(this.val.Get("txtTcCompraD").value)
        this.ret3 = Math.abs((this.ret2 - this.ret1) * this.TC)
      }
      if (this.IdMoneda == this.cFunciones.MonedaLocal) {
        this.V_Add(cuenta.CuentaContable, this.val.Get("txtConcepto").value,"",this.Valor - this.cFunciones.Redondeo(this.ret3, "2"),"D");
      }else{
        this.ValorC = this.cFunciones.Redondeo((this.val.Get("txtConcepto").value,this.Valor * this.TC),"2") - this.cFunciones.Redondeo(this.ret3, "2");
        this.V_Add(cuenta.CuentaContable, this.val.Get("txtConcepto").value,"",this.ValorC,"D");
      }
      
     }
     this.IR = Number(this.val.Get("txtIrFuente").value);
      if (this.IR > 0 ) {
        if (this.IdMoneda == this.cFunciones.MonedaLocal) {
          this.V_Add("2102-01-01-0004","Ret. " + this.val.Get("txtBeneficiario").value,"",this.Valor * (this.IR/100),"C");
          this.suma += this.Valor * (this.IR/100);
        }else{
          this.ValorC = this.cFunciones.Redondeo((this.Valor * this.TC ),"2") * this.cFunciones.Redondeo((this.IR  / 100),"2");
          this.V_Add("2102-01-01-0004","Ret. " + this.val.Get("txtBeneficiario").value,"",this.ValorC,"C");
          this.suma += this.ValorC
        }
        
      }
      this.SP = Number(this.val.Get("txtServP").value );
      if (this.SP > 0 ) {
        if (this.IdMoneda == this.cFunciones.MonedaLocal) {
          this.V_Add("2102-01-01-0004","Ret. " + this.val.Get("txtBeneficiario").value,"",this.Valor * (this.SP /100),"C");
        this.suma += this.Valor * (this.SP /100);
        } else {
          this.ValorC = this.cFunciones.Redondeo((this.Valor * this.TC),"2") * this.cFunciones.Redondeo((this.SP /100),"2")
          this.V_Add("2102-01-01-0004","Ret. " + this.val.Get("txtBeneficiario").value,"",this.ValorC,"C");
          this.suma += this.ValorC;
        }
        
      }
       this.Alcaldia = Number(this.val.Get("txtAlcaldias").value);
      if (this.Alcaldia > 0 ) {
        if (this.IdMoneda == this.cFunciones.MonedaLocal) {
          this.V_Add("2102-01-02-0002","Ret. " + this.val.Get("txtBeneficiario").value,"",this.Valor * (this.Alcaldia/100),"C");
          this.suma += this.Valor * (this.Alcaldia/100);
        } else {
          this.ValorC = this.cFunciones.Redondeo((this.Valor * this.TC),"2") * this.cFunciones.Redondeo((this.Alcaldia/100),"2")
          this.V_Add("2102-01-02-0002","Ret. " + this.val.Get("txtBeneficiario").value,"",this.ValorC,"C");
          this.suma += this.ValorC
        }
       
      }
      this.IVA = Number(this.val.Get("txtIva").value);
      if (this.IVA > 0 ) {
        if (this.IdMoneda == this.cFunciones.MonedaLocal) {
          this.V_Add("1105-01-01-0001",this.val.Get("txtBeneficiario").value,"",this.Valor * (this.IVA/100),"D");
          this.sumaDebito = this.Valor * (this.IVA/100);
        } else {
          this.ValorC = this.cFunciones.Redondeo((this.Valor * this.TC),"2")  * this.cFunciones.Redondeo((this.IVA/100),"2")
          this.V_Add("1105-01-01-0001",this.val.Get("txtBeneficiario").value,"",this.ValorC,"D");
          this.sumaDebito = this.ValorC 
        }
        
      }

     
       this.CompraD = Number(this.val.Get("txtTcCompraD").value);
       if (this.CompraD > 0) {

        this.ret1 = this.Valor / this.TC;
        this.ret2 = this.Valor / this.CompraD;
        this.ret3 = Math.abs((this.ret2 - this.ret1) * this.TC);

        this.V_Add("7101-04-01-0004",this.val.Get("txtBeneficiario").value,"",this.cFunciones.Redondeo(this.ret3 , "2"),"D");
        // this.sumaDebito = this.cFunciones.Redondeo(this.ret3,"2")
      }
      if ( this.IdMoneda == this.cFunciones.MonedaLocal) {
        detBanco.Credito = (this.cFunciones.NumFormat(this.Valor - this.suma, "2")).toString();
        detBanco.Debito = (this.cFunciones.NumFormat(Number(0), "2")).toString();
        this.ValorCheque = Number(detBanco.Credito);
      }else{
        detBanco.Credito = (this.cFunciones.NumFormat((this.Valor * this.TC) - this.suma, "2")).toString();
        detBanco.Debito = (this.cFunciones.NumFormat(Number(0), "2")).toString();
      }

      
      
      this.V_Calcular();

  }

 

  private v_Visualizar()
  {


    this.Visualizando = true;
    this.cmbCuentaBancaria.setSelectedItem(this.FILA.IdCuentaBanco);
    this.cmbBodega.setSelectedItem(this.FILA.CodBodega);
    this.cmbCuentaC.setSelectedItem(this.FILA.CuentaContable)    
    this.val.Get("txtNoDoc").setValue(this.FILA.NoCheque);
    this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.FILA.Fecha, "yyyy-MM-dd"));
    this.val.Get("txtBeneficiario").setValue(this.FILA.Beneficiario);
    this.val.Get("TxtTC").setValue(this.FILA.TasaCambio);
    this.val.Get("txtConcepto").setValue(this.FILA.Concepto);
    this.val.Get("txtTotalDolar").setValue(this.cFunciones.NumFormat(this.FILA.TotalDolar, "2"));
    this.val.Get("txtTotalCordoba").setValue(this.cFunciones.NumFormat(this.FILA.TotalCordoba, "2"));
    this.val.Get("cmbReembolsoC").disable();
    this.IdMoneda = this.FILA.IdMoneda;

    let rem : IReembolsos = {} as IReembolsos;
    rem.IdIngresoCajaChica = this.FILA.IdIngresoCaja;
    rem.Cuenta = this.FILA.CuentaIngCaja;
    rem.key = this.FILA.CuentaIngCaja;
    rem.NombreCuenta = this.FILA.CuentaIngCaja;
    rem.DetalleCaja = [];

    this.lstReembolsos.push(rem);

    this.cmbReembolsoC.select([this.FILA.CuentaIngCaja]);

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
      txtCuenta.select([f.CuentaContable]);


     // if (!txtCuenta.selection[0]?.CuentaContable.includes(f.CuentaContable[0])) txtCuenta.setSelectedItem(f.CuentaContable);




      this.valTabla.Get("txtCuenta" + f.NoLinea).setValue(f.CuentaContable);
      this.valTabla.Get("txtReferencia" + f.NoLinea).setValue(f.Referencia);
     


      let txtCentro: any = this.cmbCombo.find(y => y.id == "txtCentroCosto" + f.NoLinea);
      //if (!txtCentro.selection[0]?.Codigo.includes(f.CentroCosto[0]) && f.CentroCosto != undefined) txtCentro.setSelectedItem(f.CentroCosto);
      txtCentro.select([f.CentroCosto]);


      document.getElementById("txtCentroCosto" + f.NoLinea)?.setAttribute("disabled", "disabled");



      this.Visualizando = false;

    }, 150);



    let dialogRef: any = this.cFunciones.DIALOG.getDialogById("wait");
    if (dialogRef != undefined) dialogRef.close();


  });
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


  public V_Imprimir(Exportar : boolean) {
  
      let dialogRef: MatDialogRef<DialogoConfirmarComponent> = this.cFunciones.DIALOG.open(
        DialogoConfirmarComponent,
        {
          panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
          disableClose: true
        }
      );
  
  
  
      dialogRef.afterOpened().subscribe(s => {
        dialogRef.componentInstance.textBoton1 = "CORDOBA";
        dialogRef.componentInstance.textBoton2 = "DOLARES";
        dialogRef.componentInstance.Set_StyleBtn1("width: 150px");
        dialogRef.componentInstance.Set_StyleBtn2("width: 150px");
        dialogRef.componentInstance.SetMensajeHtml("<p style='text-align: center;'><b>"+ (Exportar ? "EXPORTAR" : "IMPRIMIR") +"</b></p><p style='text-align: center'><b style='color: blue'>" + this.val.Get("txtNoDoc").value + "</b></p>")
  
      });
  
  
      dialogRef.afterClosed().subscribe(s => {
  
        if (dialogRef.componentInstance.retorno == "0") {
          this.V_ImprimirDoc(Exportar, "");
        }
  
        if (dialogRef.componentInstance.retorno == "1") {
       
          this.V_ImprimirDoc(Exportar, this.cFunciones.MonedaLocal);
        }
  
      });
  
  
  
    }


  private V_ImprimirDoc(Exportar: boolean, Moneda : string): void {



  document.getElementById("btnImprimir-reporte-cxc-antiguedad-bodega")?.setAttribute("disabled", "disabled");

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




  this.GET.GetRptCheque(this.FILA.IdCheque, Moneda, Exportar).subscribe(
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

              document.getElementById("btnImprimir-reporte-cxc-antiguedad-bodega")?.removeAttribute("disabled");

              dialogRef.close();

              if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                  this.cFunciones.DIALOG.open(DialogErrorComponent, {
                      id: "error-servidor",
                      data: "<b class='error'>" + err.message + "</b>",
                  });
              }

          },
          complete: () => {
              document.getElementById("btnImprimir-reporte-cxc-antiguedad-bodega")?.removeAttribute("disabled");

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

  

  ngOnInit(): void {

    this.overlaySettings = {};
    document.getElementById("btnContabilizar-Cheques")?.setAttribute("disabled", "disabled");

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
    this.val.addNumberFocus("txtTotalCordoba", 2);
    this.val.addNumberFocus("txtTotalDolar", 2);



    if (this.cmbCuentaBancaria != undefined) this.cmbCuentaBancaria.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbBodega != undefined) this.cmbBodega.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";
     
   



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
    $("#offcanvasBottom-cheque-cuenta").removeAttr("show");
    $("#btnMostrarPie-cheque").trigger("click");

  }

}

