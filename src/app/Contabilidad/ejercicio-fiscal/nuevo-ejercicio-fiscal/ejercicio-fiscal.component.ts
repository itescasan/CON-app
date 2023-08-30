import { Component } from '@angular/core';
import { Validacion } from 'src/SHARED/class/validacion';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistroEjercicioFiscalComponent } from '../registro-ejercicio-fiscal/registro-ejercicio-fiscal.component';
import { PeriodosFiscalComponent } from '../periodos-fiscal/periodos-fiscal.component';
import { FormsModule } from '@angular/forms';
import { WaitComponent } from 'src/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/SHARED/interface/i-Datos';
import { iGrupo } from 'src/app/Interface/i-Grupo';
import { iPeriodo } from 'src/app/Interface/i-Periodo';
import { DialogErrorComponent } from 'src/SHARED/componente/dialog-error/dialog-error.component';
import { iCuenta } from 'src/app/Interface/i-Cuenta';
import { getCuentaContable } from '../CRUD/get-CatalogoCuenta';
import { Observable, catchError, map, startWith, tap } from 'rxjs';
import { Funciones } from 'src/SHARED/class/cls_Funciones';
import { month } from '@igniteui/material-icons-extended';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {formatDate} from '@angular/common';


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

   
  public Mascara: string = "";
  public Prefix: string = "";
  
  displayedColumns: string[] = ["NoPeriodo","NombrePeriodo","ClasePeriodo","FechaPeridoI","FechaPeridoF","Estado"];

  public lstPeriodo = new MatTableDataSource<iPeriodo> ;

  filteredCuenta1: Observable<iCuenta[]> | undefined;
  filteredCuenta2: Observable<iCuenta[]> | undefined;
  filteredCuenta3: Observable<iCuenta[]> | undefined;


  
  constructor(private DIALOG: MatDialog, private GET: getCuentaContable, private cFunciones : Funciones )
  {
    this.val.add("idEjercicioFiscal", "1", "LEN>", "0", "Ejercio_Fiscal", "Ingrese un número de cuenta.");
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

      this.val.Get("idFechaIni").setValue(this.cFunciones.FechaServer.getFullYear());
      break;
    }
  }

  public v_Select_Cuenta(event: any): void {

    let i_Cuenta: iCuenta = this.lstCuenta.find(f => f.CuentaContable == event.option.value)!;


  }

  public v_CargarDatos(): void {

    // this.lstGrupos = [];

    document.getElementById("btnRefrescar-Cuenta")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.DIALOG.open(
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
            this.DIALOG.open(DialogErrorComponent, {
              data: _json["msj"].Mensaje,
            });
          } else {

            this.iDatos = _json["d"];
            this.lstCuenta = this.iDatos.find(f => f.Nombre == "CUENTAS")?.d;




          }

        },
        error: (err) => {


          document.getElementById("btnRefrescar-Cuenta")?.removeAttribute("disabled");
          dialogRef.close();

          this.DIALOG.open(DialogErrorComponent, {
            data: "<b class='error'>" + err.message + "</b>",
          });

        },
        complete: () => { document.getElementById("btnRefrescar-Cuenta")?.removeAttribute("disabled"); }
      }
    ); 





  }
  public v_Editar(){

    this.val.Get("idFechaIni").value;
     
  }

  public fill_Table(){
    this.lstPeriodo.data.splice(0, this.lstPeriodo.data.length);
    
    for (let i = 0; i <= 11; i++) {


      let periodo : iPeriodo = {} as iPeriodo;


      

      let Fecha : Date = new Date(this.val.Get("idFechaIni").value, i, 1);
      let FechaFin = new Date(this.cFunciones.DateAdd("Month", Fecha, i));
      let mesActual = new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(new Date(Fecha));
      // FechaFin = new Date(this.cFunciones.DateAdd("Day", FechaFin, -1));
     


      periodo.NoPeriodo = i + 1;
      periodo.NombrePeriodo = mesActual.toUpperCase() + "-" + this.val.Get("idFechaIni").value;
      periodo.ClasePeriodo = 'Mensuales';
      periodo.FechaPeridoI = new Date(Fecha);
      periodo.FechaPeriodoF = new Date(FechaFin);
      periodo.Estado = 'Bloqueado';

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
