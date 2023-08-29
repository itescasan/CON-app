import { Component } from '@angular/core';
import { Validacion } from 'src/SHARED/class/validacion';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistroEjercicioFiscalComponent } from '../registro-ejercicio-fiscal/registro-ejercicio-fiscal.component';
import { PeriodosFiscalComponent } from '../periodos-fiscal/periodos-fiscal.component';
import { FormsModule } from '@angular/forms';
import { WaitComponent } from 'src/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/SHARED/interface/i-Datos';
import { iGrupo } from 'src/app/Interface/i-Grupo';
import { DialogErrorComponent } from 'src/SHARED/componente/dialog-error/dialog-error.component';
import { iCuenta } from 'src/app/Interface/i-Cuenta';
import { getCuentaContable } from '../CRUD/get-CatalogoCuenta';
import { Observable, catchError, map, startWith, tap } from 'rxjs';

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
  lstGrupos: iGrupo[] = [];

  public Mascara: string = "";
  public Prefix: string = "";
  filteredCuenta1: Observable<iCuenta[]> | undefined;
  filteredCuenta2: Observable<iCuenta[]> | undefined;
  filteredCuenta3: Observable<iCuenta[]> | undefined;
  
  constructor(private DIALOG: MatDialog, private GET: getCuentaContable )
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
      this.v_CargarDatos();
      break;
      case "Limpiar":
      break;
    }
  }

  public v_Select_Cuenta(event: any): void {

    let i_Cuenta: iCuenta = this.lstCuenta.find(f => f.CuentaContable == event.option.value)!;


  }

  public v_CargarDatos(): void {

    this.lstGrupos = [];

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
