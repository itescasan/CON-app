import { Component, ViewChild } from '@angular/core';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistroEjercicioFiscalComponent } from '../registro-ejercicio-fiscal/registro-ejercicio-fiscal.component';
import { FormsModule, UntypedFormBuilder } from '@angular/forms';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iGrupo } from 'src/app/Interface/Contabilidad/i-Grupo';
import { iPeriodo } from 'src/app/Interface/Contabilidad/i-Periodo';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iCuenta } from 'src/app/Interface/Contabilidad/i-Cuenta';
import { getCuentaContable } from '../CRUD/GET/get-CatalogoCuenta';
import { Observable, catchError, map, startWith, tap } from 'rxjs';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { check, month } from '@igniteui/material-icons-extended';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {DatePipe, formatDate} from '@angular/common';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { DialogRef } from '@angular/cdk/dialog';
import { iEjercicioFiscal } from 'src/app/Interface/Contabilidad/i-EjercicioFiscal';
import { postEjercicioFiscal } from '../CRUD/POST/post-Ejercicio-fiscal';
import { BlockScrollStrategy, GlobalPositionStrategy, ISizeInfo, IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';


@Component({
    selector: 'app-ejercicio-fiscal',
    templateUrl: './ejercicio-fiscal.component.html',
    styleUrls: ['./ejercicio-fiscal.component.scss'],
    standalone: false
})
export class EjercicioFiscalComponent {
  
  public val = new Validacion();
  inputValue: string = "";
  inputini: string = "";
  imputfin: string = '';
  public overlaySettings: OverlaySettings = {};
  public isEvent: boolean = false;


  public iDatos: iDatos[] = [];

  lstCuenta: iCuenta[] = [];
  
  public esModal: boolean = false;
  public Fila : iEjercicioFiscal = {} as iEjercicioFiscal;

  
  // public Mascara: string = "";
  // public Prefix: string = "";
  
  displayedColumns: string[] = ["NoPeriodo","NombrePeriodo","ClasePeriodo","FechaPeridoI","FechaPeridoF","Estado","Icon"];

  public lstPeriodo = new MatTableDataSource<iPeriodo> ;

  

  filteredCuenta1: Observable<iCuenta[]> | undefined;
  filteredCuenta2: Observable<iCuenta[]> | undefined;
  filteredCuenta3: Observable<iCuenta[]> | undefined;
  pipe: any;



  
  constructor(private GET: getCuentaContable, private POST: postEjercicioFiscal ,private cFunciones : Funciones )
  {
    this.val.add("idEjercicioFiscal", "1", "LEN>", "0", "Ejercio_Fiscal", "Ingrese Nombre Ejercicio Fiscal.");
    this.val.add("idFechaIni", "1", "LEN>", "0", "Fecha", "Seleccione fecha inicial.");    
    this.val.add("cmbCuenta", "1", "LEN>=", "0", "Cuenta Acumulada", "");    
    this.val.add("cmbCuenta2", "1", "LEN>", "0", "Cuenta Perdida", "Seleccione una Cuenta.");
    this.val.add("cmbCuenta3", "1", "LEN>", "0", "Cuenta Periodo","Seleccione una Cuenta.");
    this.val.add("chkBloqueadaEF", "1", "LEN>", "0", "Bloqueada", "");

    this.v_Evento("Iniciar");
  }
  


  public v_Evento(e: string): void {
    switch (e) {
      case "Iniciar":
        this.v_Evento("Limpiar");
      this.v_CargarDatos();
      break;
      case "Limpiar":
      
        this.val.Get("idEjercicioFiscal").setValue("");       
        this.val.Get("idFechaIni").setValue();
        this.val.Get("cmbCuenta").setValue("");
        this.val.Get("cmbCuenta2").setValue("");
        this.val.Get("cmbCuenta3").setValue("");
        this.val.Get("chkBloqueadaEF").setValue(true);

        this.lstPeriodo.data.splice(0, this.lstPeriodo.data.length);
        this.lstPeriodo = new MatTableDataSource<iPeriodo> ;
        
        // let chk: any = document.querySelector("#chkBloqueadaEF");
        // if (chk != undefined) chk.bootstrapToggle("on");
   
      break; 
    }
  }

  // public v_Select_Cuenta(event: any): void {

  //   let i_Cuenta: iCuenta = this.lstCuenta.find(f => f.CuentaContable == event.option.value)!;


  // }
  @ViewChild("cmbCuenta", { static: false })
  public cmbCuenta: IgxComboComponent;
 
  public v_Select_Cuenta(event: any) {
    
   this.val.Get("cmbCuenta").setValue("");
   if (event.added.length == 1) {  
     if(event.newValue.length > 1) event.newValue.splice(0, 1);
     let _Item  = this.lstCuenta.find(f => f.CuentaContable == event.newValue[0]);
     this.cmbCuenta.close();
     if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbCuenta.close();
    }
 }
 
 public v_Enter_Cuenta(event: any) {
   if (event.key == "Enter") {
     let cmb : any = this.cmbCuenta.dropdown;
     let _Item: iCuenta = cmb._focusedItem.value;
     this.cmbCuenta.setSelectedItem(_Item.CuentaContable);
     this.val.Get("cmbCuenta").setValue([_Item.CuentaContable]);
     
 
   }
 }
 @ViewChild("cmbCuenta2", { static: false })
  public cmbCuenta2: IgxComboComponent;

  public v_Select_Cuenta2(event: any) {
    this.val.Get("cmbCuenta2").setValue("");
    if (event.added.length == 1) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbCuenta2").setValue(event.newValue);     
      this.cmbCuenta2.close();
      if (window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbCuenta2.close();
    }
  }


  public v_Enter_Cuenta2(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbCuenta2.dropdown;
      let _Item: iCuenta = cmb._focusedItem.value;
      this.cmbCuenta2.setSelectedItem(_Item.CuentaContable);
      this.val.Get("cmbCuenta2").setValue([_Item.CuentaContable]);

    }
  }
  @ViewChild("cmbCuenta3", { static: false })
  public cmbCuenta3: IgxComboComponent;

  public v_Select_Cuenta3(event: any) {
    this.val.Get("cmbCuenta3").setValue("");
    if (event.added.length == 1) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      this.val.Get("cmbCuenta3").setValue(event.newValue);
      this.cmbCuenta3.close();
      if (window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbCuenta3.close();
    }
  }

  public v_Enter_Cuenta3(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbCuenta3.dropdown;
      let _Item: iCuenta = cmb._focusedItem.value;
      this.cmbCuenta3.setSelectedItem(_Item.CuentaContable);
      this.val.Get("cmbCuenta3").setValue([_Item.CuentaContable]);

      

    }
  }


  public v_CargarDatos(): void {

    // this.lstGrupos = [];
    
   
    document.getElementById("btnRefrescar")?.setAttribute("disabled", "disabled");

    
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
            this.lstCuenta = datos[0].d.filter((f: any) => f.ClaseCuenta == "D");


            // this.iDatos = _json["d"];
            // this.lstCuenta = this.iDatos.find(f => f.Nombre == "CUENTAS")?.d.filter((f: any) => f.cuenta == "D");
            // this.lstCuenta = this.iDatos[0].filter((f: any) => f.ClaseCuenta == "D");
            



          }

        },
        error: (err) => {


          document.getElementById("btnRefrescar")?.removeAttribute("disabled");
          dialogRef.close();

          this.cFunciones.DIALOG.open(DialogErrorComponent, {
            data: "<b class='error'>" + err.message + "</b>",
          });

        },
        complete: () => { document.getElementById("btnRefrescar")?.removeAttribute("disabled"); }
      }
    ); 

  }


  public v_Guardar() : void{
    this.val.EsValido();


    if (this.val.Errores != "") {
       this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
      }

      let dialogRef: MatDialogRef<WaitComponent> =  this.cFunciones.DIALOG.open(
        WaitComponent,
        {
          panelClass: "escasan-dialog-full-blur",
          data: "",
        }
      );

      
    
      this.Fila.Nombre = this.val.Get("idEjercicioFiscal").value;
      let chk: any = document.querySelector("#chkBloqueadaEF");
      console.log(this.val.Get("chkBloqueadaEF").value )      
      this.Fila.Estado = this.val.Get("chkBloqueadaEF").value  ?  'ABIERTO': 'CERRADO';   //this.val.Get("chkBloqueadoEQ").value = 'on' ? "ACTIVO" : "ANULADO";    
      this.Fila.FechaInicio = new Date(Number(this.val.Get("idFechaIni").value), 0, 1);
      this.Fila.FechaFinal = new Date(Number(this.val.Get("idFechaIni").value), 11, 31);
      this.Fila.ClasePeriodos = "Mensuales";
      this.Fila.NumerosPeriodos = 12;     
      //let i_Cuenta: iCuenta = this.lstCuenta.find(f => f.Filtro ==this.val.Get("txtCuentaA").value)!;
      this.Fila.CuentaContableAcumulada = this.val.Get("cmbCuenta").value[0];
      //let i_Cuenta2: iCuenta = this.lstCuenta.find(f => f.Filtro ==this.val.Get("txtCuentaP").value)!;
      this.Fila.CuentaPerdidaGanancia = this.val.Get("cmbCuenta2").value[0];
      //let i_Cuenta3: iCuenta = this.lstCuenta.find(f => f.Filtro ==this.val.Get("txtCuentaPr").value)!;
      this.Fila.CuentaContablePeriodo = this.val.Get("cmbCuenta3").value[0];
      this.Fila.FechaReg = new Date();
      this.Fila.UsuarioReg = this.cFunciones.User;
      // Detalle Ejercicio Fiscal (Periodos)
      this.Fila.Periodos = this.lstPeriodo.data;
      

      document.getElementById("btnGuardarEjercicioF")?.setAttribute("disabled", "disabled");

      this.POST.GuardarEjercio(this.Fila).subscribe(
        {
          next: (data) => {
  
            dialogRef.close();
            let _json : any = data;
    
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
    
    
              if(!this.esModal)   this.v_Evento("Limpiar");
    
            }
  
          },
          error: (err) => {
            dialogRef.close();
        
            document.getElementById("btnGuardarEjercicioF")?.removeAttribute("disabled");
             this.cFunciones.DIALOG.open(DialogErrorComponent, {
              data: "<b class='error'>" + err.message + "</b>",
            });
          },
          complete: () => {
            document.getElementById("btnGuardarEjercicioF")?.removeAttribute("disabled");
          }
        }
      );


    }

    public v_Bloqueada(event: any): void {
      this.val.Get("chkBloqueadaEF").setValue(event.target.checked);
     
        // if (this.isEvent) {
        //   this.isEvent = false;
        //   return;
        // }
        // this.isEvent = true; 
        // let chk: any = document.querySelector("#chkBloqueadaEF");
        //  if(!this.esModal) chk.bootstrapToggle("on");
        //  return
      
        document.getElementById("chkBloqueadaEF")?.setAttribute("disabled", "disabled");
    }

  public v_Editar(){

    this.val.Get("idFechaIni").value;
     
  }

  public E_ditar(det: iPeriodo) {
    let dialogRef: MatDialogRef<DialogoConfirmarComponent> =  this.cFunciones.DIALOG.open(
      DialogoConfirmarComponent,
      {
        disableClose: true

      }
    );

    dialogRef.componentInstance.mensaje = "<p class='Bold'>Esta Seguro Cambiar el Estado</p>";
    dialogRef.componentInstance.textBoton1 = (det.Estado == 'ABIERTO' ? 'BLOQUEADO' : "ABIERTO");
    dialogRef.componentInstance.textBoton2 = "CANCELAR";

    dialogRef.afterClosed().subscribe(s => {
      if (dialogRef.componentInstance.retorno == "1") {
        if (det.Estado  == 'ABIERTO' ) {
          det.Estado = "BLOQUEADO";
        }
        else{
          det.Estado = "ABIERTO";
        }
      }
    });
  }

  public fill_Table(){
    if(this.esModal) return;
    this.lstPeriodo.data.splice(0, this.lstPeriodo.data.length);
    
    for (let i = 0; i <= 11; i++) {


      let periodo : iPeriodo = {} as iPeriodo;


      

      let Fecha : Date = new Date(this.val.Get("idFechaIni").value, i, 1);
      let FechaFin = new Date(this.cFunciones.LastDay(Fecha));
      let mesActual = new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(new Date(Fecha));
      //pipe = new DatePipe('en-US');

      periodo.IdPeriodo = undefined;
      periodo.IdEjercicio = undefined;
      periodo.NoPeriodo = i + 1;
      periodo.NombrePeriodo = mesActual.toUpperCase() + "-" + this.val.Get("idFechaIni").value;
      periodo.ClasePeriodo = 'Mensuales';
      periodo.FechaInicio = new Date(Fecha).toDateString();
      periodo.FechaFinal = new Date(FechaFin).toDateString();
      periodo.Estado = 'BLOQUEADO';
      periodo.FechaReg = new Date();      
      periodo.UsuarioReg = this.cFunciones.User;
      this.lstPeriodo.data.push(periodo); 
     
    }
     
    this.lstPeriodo.filter = "";
  }

  ngOnInit() : void{

    
    this.overlaySettings = {};

    if (window.innerWidth <= 992) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }
   

    let lstcheckbox: any = document.querySelectorAll("input[type='checkbox']");
      lstcheckbox.forEach((f: any) => {
        f.bootstrapToggle();
      });
   
    }

    
   
}
