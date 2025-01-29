import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iCuenta } from 'src/app/Interface/Contabilidad/i-Cuenta';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { iCentroCosto } from 'src/app/Interface/Contabilidad/i-Centro-Costo';
import { iOrderBy } from 'src/app/SHARED/interface/i-OrderBy';
import { PDFDocument } from 'pdf-lib';
import * as printJS from 'print-js';
import { MatMenuTrigger } from '@angular/material/menu';
import { getIngresoCaja } from '../CRUD/GET/getIngresoCaja';
import { postIngresoCaja } from '../CRUD/POST/postIngresoCaja';
import { iIngCajaDetalle } from 'src/app/Interface/Contabilidad/i-IngresoCaja-Detalle';
import { iIngCaja } from 'src/app/Interface/Contabilidad/i-IngresoCaja';
import { iAccesoCaja } from 'src/app/Interface/Contabilidad/i-AccesoCajaChica';
import { iConfCaja } from 'src/app/Interface/Contabilidad/i-ConfCajaChica';
import { iConfC } from 'src/app/Interface/Contabilidad/i-ConfCaja';
import { usaCa } from '@igniteui/material-icons-extended';
import { iIngresoCajaPost } from 'src/app/Interface/Contabilidad/i-IngresoCaja-POST';
import { iValCaja } from 'src/app/Interface/Contabilidad/i-Validacion-Caja';
import { faShopSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-nuevo-ingreso-caja',
    templateUrl: './nuevo-ingreso-caja.component.html',
    styleUrl: './nuevo-ingreso-caja.component.scss',
    standalone: false
})
export class NuevoIngresoCajaComponent {

  public overlaySettings: OverlaySettings = {};
  public val = new Validacion();
  public valTabla = new Validacion();
  public load :boolean = false;

  lstBodega: iAccesoCaja[] = [];
  lstRubros: iAccesoCaja[] = [];
  lstCentroCosto: iCentroCosto[] = [];
  lstEmpleado : iAccesoCaja[] = [];
  lstInfoCaja : iConfC[] = [];
  

  lstCount : {} = {};

  @ViewChildren(IgxComboComponent)
  public cmbCuenta: QueryList<IgxComboComponent>;

  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iIngCajaDetalle>;
  public LstValCaja = new MatTableDataSource<iValCaja>;

  public FILA: iIngCaja= {} as iIngCaja;

  public esModal: boolean = false;
  public TC: number;
  public Anulado: boolean = false;  
  public dec_Aplicado: number = 0;
  public dec_Contabilizado:  boolean = false;
  public gas_Caja: number = 0; 
  public sal_Disponible: number = 0; 
  public mont_Caja: number = 0;
  public IdCaja: number = 0; 
  private Eliminar : boolean = false;
  

  public orderby: iOrderBy[] = [
    { Columna: "Cuenta", Direccion: "" },
    { Columna: "Concepto", Direccion: "" },
    { Columna: "Referencia", Direccion: "" },
    { Columna: "FechaRegistro", Direccion: "" },
  ];

  @ViewChildren(IgxComboComponent)
  public cmbCombo: QueryList<IgxComboComponent>; 

  constructor(public cFunciones: Funciones, private GET: getIngresoCaja, private POST: postIngresoCaja) {


    
    this.val.add("cmbBodega", "1", "LEN>", "0", "Bodega", "Seleccione una Bodega.");
    this.val.add("cmbRubro", "1", "LEN>", "0", "Centro Costo", "No se ha definido el Rubro.");
    this.val.add("cmbCentroCosto", "1", "LEN>", "0", "Centro Costo", "Seleccione un centro costo.");
    this.val.add("cmbEmpleado", "1", "LEN>", "0", "Empleado", "Ingrese el Empleado.");    
    this.val.add("txtConsecutivo", "1", "LEN>", "0", "Consecutivo", "No se ha definido el número de consecutivo.");
    this.val.add("txtReferencia", "1", "LEN>", "0", "Referencia", "Ingrese la Referencia.");
    this.val.add("txtProveedor", "1", "LEN>", "0", "Proveedor", "Ingrese el Proveedor.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Ingrese la Fecha.");
    this.val.add("txtConcepto", "1", "LEN>", "0", "Concepto", "Ingrese el Concepto.");
    this.val.add("txtSubTotal", "1", "NUM>", "0", "Subtotal", "Ingrese el Valor del Sub-Total.");
    this.val.add("txtIVA", "1", "NUM>=", "0", "IVA", "Ingrese el IVA.");
    this.val.add("txtTotal", "1", "NUM>=", "0", "Total", "Ingrese el Total.");
  
    
    // this.val.add("cmbProveedor", "1", "LEN>", "0", "Proveedor", "Seleccione un proveedor.");
    // this.val.add("txtMoneda", "1", "LEN>", "0", "Moneda", "No se ha especificado la moneda de la cuenta.");
    // this.val.add("TxtTC", "1", "NUM>", "0", "Tasa Cambio", "No se ha configurado el tipo de cambio.");
    // this.val.add("txtComision", "1", "NUM>=", "0", "Banco", "Revisar la comisión bancaria.");
    // this.val.add("txtConcepto", "1", "LEN>", "0", "Concepto", "Ingrese un concepto.");
    // this.val.add("txtTotalCordoba", "1", "LEN>=", "0", "Total Cordoba", "");
    // this.val.add("txtTotalDolar", "1", "LEN>=", "0", "Total Dolar", "");
    
 

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
        this.FILA.IdIngresoCajaChica = 0;
        this.sal_Disponible = 0;
        this.dec_Aplicado = 0;
        this.mont_Caja = 0;

        this.lstDetalle.data.splice(0, this.lstDetalle.data.length);
        this.lstDetalle = new MatTableDataSource<iIngCajaDetalle>; 


        this.val.Get("cmbBodega").setValue("");
        this.val.Get("cmbRubro").setValue("");
        this.val.Get("cmbCentroCosto").setValue("");
        this.val.Get("cmbEmpleado").setValue("");
        this.val.Get("txtConsecutivo").setValue("");//SVGAElement
        this.val.Get("txtReferencia").setValue("");
        this.val.Get("txtProveedor").setValue("");
        this.val.Get("txtFecha").setValue(this.cFunciones.ShortFechaServidor());
        this.val.Get("txtConcepto").setValue("");
        this.val.Get("txtSubTotal").setValue("0.00");
        this.val.Get("txtIVA").setValue("0.00");
        this.val.Get("txtTotal").setValue("0.00");       



        this.val.Get("txtConsecutivo").disable();
        this.val.Get("cmbEmpleado").disable();
        this.val.Get("txtTotal").disable();
        // this.val.Get("txtMoneda").disable();
        // //this.val.Get("TxtTC").disable();
        // this.val.Get("txtTotalDolar").disable();
        // this.val.Get("txtTotalCordoba").disable();
        // this.val.Get("txtComision").disable();


        if (this.lstBodega.length > 0) this.cmbBodega?.setSelectedItem(this.lstBodega[0].CuentaContable);  

        break;
    }
  }


  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  public v_Select_Bodega(event: any) {
    
    this.val.Get("cmbBodega").setValue("");
    
    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbBodega").setValue(event.newValue);
      this.v_Rubro();      
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbBodega.close();
      this.cmbBodega.close();
    }

    
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbBodega.dropdown;
      let _Item: iAccesoCaja = cmb._focusedItem.value;
      
      this.cmbBodega.setSelectedItem(_Item.CuentaContable);
      this.val.Get("cmbBodega").setValue([_Item.CuentaContable]);

    }
  }


  @ViewChild("cmbRubro", { static: false })
  public cmbRubro: IgxComboComponent;

  public v_Select_Rubro(event: any) {
    this.val.Get("cmbRubro").setValue("");
    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbRubro").setValue(event.newValue);
      let cmb: any = this.cmbRubro.dropdown;
      let _Item: iAccesoCaja = cmb._focusedItem.value;
      this.cmbRubro.setSelectedItem(_Item.CuentaContable);
      this.val.Get("cmbRubro").setValue([_Item.CuentaContable]);
      //this.val.Get("cmbRubro").setValue([_Item.NombreCuenta])
      this.v_EnableCmbEmpleado(_Item?.NombreCuenta);
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbBodega.close();
      this.cmbRubro.close();
    }
  }

  public v_Enter_Rubro(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbRubro.dropdown;
      let _Item: iAccesoCaja = cmb._focusedItem.value;
      this.cmbRubro.setSelectedItem(_Item.CuentaContable);
      this.val.Get("cmbRubro").setValue([_Item.CuentaContable]);
      //this.val.Get("cmbRubro").setValue([_Item.NombreCuenta])
      this.v_EnableCmbEmpleado(_Item?.NombreCuenta);
        

    }
  }


  @ViewChild("cmbCentroCosto", { static: false })
  public cmbCentroCosto: IgxComboComponent;

  public v_Select_CentroCosto(event: any) {

    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbCentroCosto").setValue(event.newValue);     
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbCentroCosto.close();
      this.cmbCentroCosto.close();
    }
  }

  public v_Enter_CentroCosto(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbCentroCosto.dropdown;
      let _Item: iCentroCosto = cmb._focusedItem?.value;
      this.cmbCentroCosto.setSelectedItem(_Item?.Codigo);
      this.val.Get("cmbCentroCosto").setValue([_Item?.Codigo]);      
    }
  }


  
  @ViewChild("cmbEmpleado", { static: false })
  public cmbEmpleado: IgxComboComponent;

  public v_Select_Empleado(event: any) {

    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbEmpleado").setValue(event.newValue);
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbEmpleado.close();
      this.cmbEmpleado.close();
    }
  }

  public v_Enter_Empleado(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbEmpleado.dropdown;
      let _Item: iAccesoCaja = cmb._focusedItem?.value;
      this.cmbEmpleado.setSelectedItem(_Item?.CuentaContable);
      this.val.Get("cmbEmpleado").setValue([_Item?.CuentaContable]);

    }
  }



  public v_FocusOut(id: string): void {
    this.val.Get(id).setValue(this.cFunciones.NumFormat(this.val.Get(id).value.replaceAll(",", ""), "2"));
  }

  public v_EnableCmbEmpleado(NombreCuenta: string): void
  {
    let array = ['ALIMENTACION','HOSPEDAJE','TRANSPORTE'];
    let cuenta = NombreCuenta.split("->");
    array.includes(cuenta[1])
    if (array.includes(cuenta[1])) {
      this.val.Get("cmbEmpleado").enable();
      this.val.replace("cmbEmpleado", "1","LEN>", "0", "Seleccione un Empleado.")
    }else {
      this.val.Get("cmbEmpleado").disable();
      this.val.Get("cmbEmpleado").setValue("");
      this.val.replace("cmbEmpleado", "1","LEN>=", "0", "Seleccione una Empleado.")
    }
  }



  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

  public v_CargarDatos(): void {
    document.getElementById("btnRefrescar-Caja")?.setAttribute("disabled", "disabled");


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

    this.GET.Datos(this.cFunciones.User).subscribe(
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
            this.lstCentroCosto = datos[1]?.d; 


            if (this.cmbBodega.selection.length == 0) this.cmbBodega.setSelectedItem(this.lstBodega[0]?.CuentaContable);

            this.v_Rubro();
            
            //if (this.esModal) this.v_Visualizar();


      }

    },
    error: (err) => {


      dialogRef.close();

      document.getElementById("btnRefrescar-Caja")?.removeAttribute("disabled");
      if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
        this.cFunciones.DIALOG.open(DialogErrorComponent, {
          id: "error-servidor",
          data: "<b class='error'>" + err.message + "</b>",
        });
      }

    },
    complete: () => { document.getElementById("btnRefrescar-Caja")?.removeAttribute("disabled"); }
    } 
  );

  }

  public v_Rubro(): void {

    if (this.cmbBodega.selection.length == 0) return;


    this.GET.Rubro(this.val.Get("cmbBodega").value).subscribe(
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
            this.lstRubros = datos[0].d;
            this.lstInfoCaja = datos[1].d;
            this.lstEmpleado = datos[2].d;            
            if (!this.esModal) this.val.Get("txtConsecutivo").setValue(this.lstInfoCaja[0].Consecutivo);
            this.mont_Caja = this.cFunciones.Redondeo(this.lstInfoCaja[0].Valor, "2");
            this.v_llenarDatos(this.lstInfoCaja[0].Consecutivo,this.cFunciones.User,this.lstInfoCaja[0].CuentaContable);
            
            if ( this.lstDetalle.data.length > 0) {
              this.v_ValidarCaja(this.lstInfoCaja[0].Consecutivo,this.lstInfoCaja[0].CuentaContable);
            }else{
              
            }         
           

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
 
 
  public V_CalcularSaldo() {

    this.TC = this.cFunciones.Redondeo(Number(String(this.val.Get("TxtTC").value).replaceAll(",", "")), "4");

    this.lstDetalle.data.forEach(f => {

      let saldo: number = 0
      let saldoDolar: number = 0
      let saldoCordoba: number = 0


    });

    this.V_Calcular();
  }


  public V_Calcular(): void {
    let Subtotal =  Number(this.val.Get("txtSubTotal").value.toString().replaceAll(",", ""));
    let IVA = Number(this.val.Get("txtIVA").value.toString().replaceAll(",", ""));
    let Total = this.cFunciones.NumFormat(Number(Subtotal + IVA), "2");
    this.val.Get("txtTotal").setValue(Total);    

    this.sal_Disponible = 0;
    //this.mont_Caja = 0;
    this.gas_Caja = 0;
        
    if (this.lstDetalle.data.length > 0) {
      this.lstDetalle.data.forEach(f => {
        this.IdCaja = f.IdIngresoCajaC
        if (f.IdIngresoCajaC == undefined) f.IdIngresoCajaC = 0;
  
        this.gas_Caja += f.SubTotal
        this.sal_Disponible = this.mont_Caja - this.gas_Caja
  
      });
    }else{
      this.sal_Disponible = this.mont_Caja - Number(String(this.val.Get("txtTotal").value).replaceAll(",", ""))
    }
    this.sal_Disponible = this.sal_Disponible - Number(String(this.val.Get("txtTotal").value).replaceAll(",", ""))
    if (this.sal_Disponible < 0) {
      document.getElementById("btnGuardar-IngCaja")?.removeAttribute("enabled");
      document.getElementById("btnGuardar-IngCaja")?.setAttribute("disabled", "disabled");
    }else{
      document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
      document.getElementById("btnGuardar-IngCaja")?.setAttribute("enabled", "enabled");
    }

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
  
      this.FILA.IdIngresoCajaChica = this.IdCaja;
      this.FILA.Cuenta = this.val.Get("cmbBodega").value[0];
      this.FILA.Consecutivo = this.val.Get("txtConsecutivo").value;
      this.FILA.Usuario = this.cFunciones.User;
      this.FILA.UsuarioModifica = this.cFunciones.User;
      this.FILA.Aplicado = false;
      this.FILA.Contabilizado = false;
      this.FILA.Corregir = "";
      

      let det: iIngCajaDetalle  = {} as iIngCajaDetalle;

      det.IdDetalleIngresoCajaChica = -1;
      det.IdIngresoCajaC = -1;     
      det.FechaFactura = this.val.Get("txtFecha").value;
      det.Concepto = this.val.Get("txtConcepto").value;
      det.Referencia = this.val.Get("txtReferencia").value;
      det.Proveedor = this.val.Get("txtProveedor").value;
      det.Cuenta = this.val.Get("cmbRubro").value[0];
      det.CentroCosto = this.val.Get("cmbCentroCosto").value[0];
      det.SubTotal = Number(String(this.val.Get("txtSubTotal").value).replaceAll(",", ""));
      det.Iva = Number(String(this.val.Get("txtIVA").value).replaceAll(",", ""));
      det.Total = Number(String(this.val.Get("txtTotal").value).replaceAll(",", ""));

      det.CuentaEmpleado = this.val.Get("cmbEmpleado").value == undefined ?  "" : this.val.Get("cmbEmpleado").value[0]; 
      
  
      if (!this.esModal) {      
  
      }
  
  
      let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
        WaitComponent,
        {
          panelClass: "escasan-dialog-full-blur",
          data: "",
        }
      );
  
      document.getElementById("btnGuardar-IngCaja")?.setAttribute("disabled", "disabled");
  
  
      let Datos : iIngresoCajaPost = {} as iIngresoCajaPost;
      Datos.I = this.FILA;
      Datos.D = det;
  
      this.POST.GuardarIngresoCaja(Datos).subscribe(
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
  
              this.v_Rubro();

              if (!this.esModal) this.v_Evento("Limpiar");
  
            }
  
          },
          error: (err) => {
            dialogRef.close();
  
            document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
            if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor",
                data: "<b class='error'>" + err.message + "</b>",
              });
            }
          },
          complete: () => {
            document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
          }
        }
      );
  

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
  public v_llenarDatos(Consecutivo : number, Usuario : string, CuentaBodega : string) {

    document.getElementById("btnRefrescar-Caja")?.setAttribute("disabled", "disabled");


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

    this.GET.Get(Consecutivo,Usuario,CuentaBodega).subscribe(
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

            this.lstDetalle.data = datos[0].d;
            // if (!(this.lstDetalle.data.length > 0)) {
            //   this.IdCaja = 0;
            // }               
            this.V_Calcular();
            


            if (this.cmbBodega.selection.length == 0) this.cmbBodega.setSelectedItem(this.lstBodega[0]?.CuentaContable);
            
            //if (this.esModal) this.v_Visualizar();


      }

    },
    error: (err) => {


      dialogRef.close();

      document.getElementById("btnRefrescar-Caja")?.removeAttribute("disabled");
      if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
        this.cFunciones.DIALOG.open(DialogErrorComponent, {
          id: "error-servidor",
          data: "<b class='error'>" + err.message + "</b>",
        });
      }

    },
    complete: () => { document.getElementById("btnRefrescar-Caja")?.removeAttribute("disabled"); }
    } 
  );
   
  }


  public v_ValidarCaja(Consecutivo : number, CuentaPadre : string) {

    document.getElementById("btnRefrescar-Caja")?.setAttribute("disabled", "disabled");


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

    this.GET.Validar(Consecutivo,CuentaPadre).subscribe(
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

            this.LstValCaja.data = datos[0].d; 
            
            if (this.LstValCaja.data.length > 0) {
              if (this.LstValCaja.data[0].Enviado == true && this.LstValCaja.data[0].Corregir == "Pendiente") {
                document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
                document.getElementById("btnImprimir-IngCaja")?.removeAttribute("disabled");
                document.getElementById("btnGuardar-IngCaja")?.setAttribute("enabled", "enabled");
                document.getElementById("btnImprimir-IngCaja")?.setAttribute("enabled", "enabled");
                this.Eliminar = true;
              }else            
              {
                if (this.LstValCaja.data[0].Enviado == false && this.LstValCaja.data[0].Corregir == "") {
                  document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
                  document.getElementById("btnImprimir-IngCaja")?.removeAttribute("disabled");
                  document.getElementById("btnGuardar-IngCaja")?.setAttribute("enabled", "enabled");
                  document.getElementById("btnImprimir-IngCaja")?.setAttribute("enabled", "enabled");
                  this.Eliminar = true;
                }else{
                  document.getElementById("btnGuardar-IngCaja")?.removeAttribute("enabled");
                  document.getElementById("btnImprimir-IngCaja")?.removeAttribute("enabled");
                  document.getElementById("btnGuardar-IngCaja")?.setAttribute("disabled", "disabled");
                  document.getElementById("btnImprimir-IngCaja")?.setAttribute("disabled", "disabled");
                  this.Eliminar = false;
                }
                
              }
            } else {
                  document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
                  document.getElementById("btnImprimir-IngCaja")?.removeAttribute("disabled");
                  document.getElementById("btnGuardar-IngCaja")?.setAttribute("enabled", "enabled");
                  document.getElementById("btnImprimir-IngCaja")?.setAttribute("enabled", "enabled");
                  this.Eliminar = true;
            }
            
            

            //if (this.cmbBodega.selection.length == 0) this.cmbBodega.setSelectedItem(this.lstBodega[0]?.CuentaContable);
            
            //if (this.esModal) this.v_Visualizar();


      }

    },
    error: (err) => {


      dialogRef.close();

      document.getElementById("btnRefrescar-Caja")?.removeAttribute("disabled");
      if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
        this.cFunciones.DIALOG.open(DialogErrorComponent, {
          id: "error-servidor",
          data: "<b class='error'>" + err.message + "</b>",
        });
      }

    },
    complete: () => { document.getElementById("btnRefrescar-Caja")?.removeAttribute("disabled"); }
    } 
  );
   
  }

  
  V_Eliminar(item: iIngCajaDetalle) {
    

    let i = this.lstDetalle.data.findIndex(f => f.IdDetalleIngresoCajaChica == item.IdDetalleIngresoCajaChica);

    if (i == -1) return;
    let dialogRef: MatDialogRef<DialogoConfirmarComponent> =  this.cFunciones.DIALOG.open(
      DialogoConfirmarComponent,
      {
        disableClose: true

      }
    );
    if (!(this.Eliminar)) {
      dialogRef.componentInstance.mensaje = "<p class='Bold'>No Puede Eliminar Este Registro Pendiente de Revision</p>";
    } else {
      dialogRef.componentInstance.mensaje = "<p class='Bold'>Esta Seguro Eliminar Este Registro</p>";
    }

   
    dialogRef.componentInstance.textBoton1 = ("ACEPTAR");
    dialogRef.componentInstance.textBoton2 = "CANCELAR";

    dialogRef.afterClosed().subscribe(s => {
      if (dialogRef.componentInstance.retorno == "1") {
        if (this.Eliminar) {
          this.v_Eliminar_IngCaja(item.IdDetalleIngresoCajaChica)
        } else {
          
        }
        
      }
    });
       

  }


  v_Eliminar_IngCaja(id : number)  {
    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    document.getElementById("btnGuardar-IngCaja")?.setAttribute("disabled", "disabled");


    // let Datos : iIngresoCajaPost = {} as iIngresoCajaPost;
    // Datos.I = this.FILA;
    // Datos.D = det;

    this.POST.EliminarDetalleCaja(id).subscribe(
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

            this.v_Rubro();

            if (!this.esModal) this.v_Evento("Limpiar");

          }

        },
        error: (err) => {
          dialogRef.close();

          document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
        }
      }
    );
  }

  public v_ImprimirIngCaja() {   

    document.getElementById("btnImprimir-IngCaja")?.setAttribute("disabled", "disabled");
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


    this.GET.GetRptIngCaja(this.IdCaja).subscribe(
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
          document.getElementById("btnImprimir-IngCaja")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnImprimir-IngCaja")?.removeAttribute("disabled");


        }
      }
    );


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


  ngAfterViewInit(): void {
    ///CAMBIO DE FOCO    
    this.val.addFocus("txtReferencia", "txtProveedor", undefined);
    this.val.addFocus("txtProveedor", "txtFecha", undefined);
    this.val.addFocus("txtFecha", "txtConcepto", undefined);
    this.val.addFocus("txtConcepto", "txtSubTotal", undefined);
    this.val.addFocus("txtSubTotal", "txtIVA", undefined);
    //this.val.addFocus("txtIVA", "btn-imprimir", undefined);

 
  }
   
  
   //██████████████████████████████████████████POPUP██████████████████████████████████████████████████████

   @ViewChild(MatMenuTrigger)
   contextMenu: MatMenuTrigger;
   contextMenuPosition = { x: '0px', y: '0px' };
   public V_Popup(event: MouseEvent, item: iIngCajaDetalle): void {
     event.preventDefault();
     this.contextMenuPosition.x = event.clientX + 'px';
     this.contextMenuPosition.y = event.clientY + 'px';
     this.contextMenu.menuData = { 'item': item };
     this.contextMenu.menu!.focusFirstItem('mouse');
     this.contextMenu.openMenu();
   }

  
}
