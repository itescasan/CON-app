import { Component } from '@angular/core';
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
import {formatDate} from '@angular/common';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { DialogRef } from '@angular/cdk/dialog';
import { iEjercicioFiscal } from 'src/app/Interface/Contabilidad/i-EjercicioFiscal';
import { postEjercicioFiscal } from '../CRUD/POST/post-Ejercicio-fiscal';



@Component({
  selector: 'app-ejercicio-fiscal',
  templateUrl: './ejercicio-fiscal.component.html',
  styleUrls: ['./ejercicio-fiscal.component.scss']
})
export class EjercicioFiscalComponent {
  
  public val = new Validacion();
  inputValue: string = "";
  inputini: string = "";
  imputfin: string = '';

  public iDatos: iDatos[] = [];

  lstCuenta: iCuenta[] = [];
  
  public esModal: boolean = false;
  public Fila : iEjercicioFiscal = {} as iEjercicioFiscal;

   
  // public Mascara: string = "";
  // public Prefix: string = "";
  
  displayedColumns: string[] = ["NoPeriodo","NombrePeriodo","ClasePeriodo","FechaPeridoI","FechaPeridoF","Estado"];

  public lstPeriodo = new MatTableDataSource<iPeriodo> ;

  

  filteredCuenta1: Observable<iCuenta[]> | undefined;
  filteredCuenta2: Observable<iCuenta[]> | undefined;
  filteredCuenta3: Observable<iCuenta[]> | undefined;


  
  constructor(private GET: getCuentaContable, private POST: postEjercicioFiscal ,private cFunciones : Funciones )
  {
    this.val.add("idEjercicioFiscal", "1", "LEN>", "0", "Ejercio_Fiscal", "Ingrese Nombre Ejercicio Fiscal.");
    this.val.add("idFechaIni", "1", "LEN>", "0", "Fecha", "Seleccione fecha inicial.");    
    this.val.add("txtCuentaA", "1", "LEN>=", "0", "Cuenta Acumulada", "");    
    this.val.add("txtCuentaP", "1", "LEN>", "0", "Cuenta Perdida", "Seleccione una Cuenta.");
    this.val.add("txtCuentaPr", "1", "LEN>", "0", "Cuenta Periodo","Seleccione una Cuenta.");
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
        this.val.Get("txtCuentaA").setValue("");
        this.val.Get("txtCuentaP").setValue("");
        this.val.Get("txtCuentaPr").setValue("");
        this.val.Get("chkBloqueadaEF").setValue(true);

        this.lstPeriodo.data.splice(0, this.lstPeriodo.data.length);
        this.lstPeriodo = new MatTableDataSource<iPeriodo> ;
        
        let chk: any = document.querySelector("#chkBloqueadaEF");
        if (chk != undefined) chk.bootstrapToggle("on");
   
      break; 
    }
  }

  public v_Select_Cuenta(event: any): void {

    let i_Cuenta: iCuenta = this.lstCuenta.find(f => f.CuentaContable == event.option.value)!;


  }

  public v_CargarDatos(): void {

    // this.lstGrupos = [];
    
   
    document.getElementById("btnRefrescar-Cuenta")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> =  this.cFunciones.DIALOG.open(
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

            this.iDatos = _json["d"];
            this.lstCuenta = this.iDatos.find(f => f.Nombre == "CUENTAS")?.d;




          }

        },
        error: (err) => {


          document.getElementById("btnRefrescar-Cuenta")?.removeAttribute("disabled");
          dialogRef.close();

          this.cFunciones.DIALOG.open(DialogErrorComponent, {
            data: "<b class='error'>" + err.message + "</b>",
          });

        },
        complete: () => { document.getElementById("btnRefrescar-Cuenta")?.removeAttribute("disabled"); }
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

      console.log(this.val.Get("idFechaIni").value)
    
      this.Fila.Nombre = this.val.Get("idEjercicioFiscal").value;
      this.Fila.Estado = this.val.Get("chkBloqueadaEF").value === true ?  'ABIERTO': 'CERRADO';
      this.Fila.FechaInicio = new Date(Number(this.val.Get("idFechaIni").value), 0, 1);
      this.Fila.FechaFinal = new Date(this.val.Get("idFechaIni").value, 12, 31);
      this.Fila.ClasePeriodos = "Mensuales";
      this.Fila.NumerosPeriodos = 12;     
      let i_Cuenta: iCuenta = this.lstCuenta.find(f => f.Filtro ==this.val.Get("txtCuentaA").value)!;
      this.Fila.CuentaContableAcumulada = i_Cuenta.CuentaContable;
      let i_Cuenta2: iCuenta = this.lstCuenta.find(f => f.Filtro ==this.val.Get("txtCuentaP").value)!;
      this.Fila.CuentaPerdidaGanancia = i_Cuenta2.CuentaContable;
      let i_Cuenta3: iCuenta = this.lstCuenta.find(f => f.Filtro ==this.val.Get("txtCuentaPr").value)!;
      this.Fila.CuentaContablePeriodo = i_Cuenta3.CuentaContable;
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
    dialogRef.componentInstance.textBoton1 = "ABIERTO";
    dialogRef.componentInstance.textBoton2 = "CERRADO";

    dialogRef.afterClosed().subscribe(s => {
      if (dialogRef.componentInstance.retorno == "1") {
        if (det.Estado  == 'ABIERTO' ) {
          det.Estado = "CERRADO";
        }
        else{
          det.Estado = "ABIERTO";
        }
      }
    })
  }

  public fill_Table(){
    this.lstPeriodo.data.splice(0, this.lstPeriodo.data.length);
    
    for (let i = 0; i <= 11; i++) {


      let periodo : iPeriodo = {} as iPeriodo;


      

      let Fecha : Date = new Date(this.val.Get("idFechaIni").value, i, 1);
      let FechaFin = new Date(this.cFunciones.LastDay(Fecha));
      let mesActual = new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(new Date(Fecha));
   
      periodo.IdPeriodo = undefined;
      periodo.IdEjercicio = undefined;
      periodo.NoPeriodo = i + 1;
      periodo.NombrePeriodo = mesActual.toUpperCase() + "-" + this.val.Get("idFechaIni").value;
      periodo.ClasePeriodo = 'Mensuales';
      periodo.FechaInicio = new Date(Fecha);
      periodo.FechaFinal = new Date(FechaFin);
      periodo.Estado = 'BLOQUEADO';
      periodo.FechaReg = new Date();      
      periodo.UsuarioReg = this.cFunciones.User;
      this.lstPeriodo.data.push(periodo); 
     
    }
     
    this.lstPeriodo.filter = "";
  }

  ngOnInit() : void{

  
     //FILTRO CLIENTE
     this.filteredCuenta1 = this.val.Get("txtCuentaA").valueChanges.pipe(
      startWith(""),
      map((value: string) => {
        return this.lstCuenta.filter((option) =>
          option.Filtro.toLowerCase().includes(
            (value || "").toLowerCase().trimStart()
          )
        );
      })
    );

    this.filteredCuenta2 = this.val.Get("txtCuentaP").valueChanges.pipe(
      startWith(""),
      map((value: string) => {
        return this.lstCuenta.filter((option) =>
          option.Filtro.toLowerCase().includes(
            (value || "").toLowerCase().trimStart()
          )
        );
      })
    );

    this.filteredCuenta3 = this.val.Get("txtCuentaPr").valueChanges.pipe(
      startWith(""),
      map((value: string) => {
        return this.lstCuenta.filter((option) =>
          option.Filtro.toLowerCase().includes(
            (value || "").toLowerCase().trimStart()
          )
        );
      })
    );



    let lstcheckbox: any = document.querySelectorAll("input[type='checkbox']");
      lstcheckbox.forEach((f: any) => {
        f.bootstrapToggle();
      });
   
    }
}
