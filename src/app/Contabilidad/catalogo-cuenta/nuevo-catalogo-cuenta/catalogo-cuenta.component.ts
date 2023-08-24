import { Component } from '@angular/core';
import { Validacion } from 'src/SHARED/class/validacion';
import * as $ from 'jquery';
import { Observable, catchError, map, startWith, tap } from 'rxjs';
import { iCuenta } from 'src/app/Interface/i-Cuenta';
import { getCuentaContable } from '../CRUD/GET/get-CatalogoCuenta';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WaitComponent } from 'src/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/SHARED/interface/i-Datos';

@Component({
  selector: 'app-catalogo-cuenta',
  templateUrl: './catalogo-cuenta.component.html',
  styleUrls: ['./catalogo-cuenta.component.scss']
})
export class CatalogoCuentaComponent {

  public val = new Validacion();
  public esModal: boolean = false;

  public Mascara : string = "";
  public CuentaPadre : string = "";

  lstCuentaPadre: iCuenta[] = [];
  filteredCuentaPadre: Observable<iCuenta[]> | undefined;


  constructor(private DIALOG: MatDialog, private GET : getCuentaContable) {
    this.val.add("txtCuenta", "1", "LEN>", "0", "Cuenta", "Ingrese un número de cuenta.");
    this.val.add("cmbNivel", "1", "LEN>", "0", "Nivel", "Seleccione un nivel.");
    this.val.add("txtDescripcion", "1", "LEN>", "0", "Descripción", "Ingrese la descripción de la cuenta.");
    this.val.add("txtCuentaPadre", "1", "LEN>=", "0", "Cuenta Padre", "");
    this.val.add("txtDescripcionPadre", "1", "LEN>=", "0", "Descripcion Cuenta Padre", "");
    this.val.add("cmbGrupo", "1", "LEN>", "0", "Group", "Seleccione un grupo.");
    this.val.add("cmbClase", "1", "LEN>", "0", "Clase", "Seleccione una clase.");
    this.val.add("chkBloqueada", "1", "LEN>", "0", "Bloqueada", "");

    this.v_Iniciar("Iniciar");
  }




  private v_Iniciar(e: string): void {
    switch (e) {
      case "Iniciar":
        this.v_CargarDatos();
        this.esModal = false;
        break;

      case "Limpiar":

      this.Mascara = "";


        this.val.Get("txtCuenta").setValue();
        this.val.Get("cmbNivel").setValue("");
        this.val.Get("txtDescripcion").setValue("");
        this.val.Get("txtCuentaPadre").setValue("");
        this.val.Get("txtDescripcionPadre").setValue("");
        this.val.Get("cmbGrupo").setValue("");
        this.val.Get("cmbClase").setValue("");
        this.val.Get("chkBloqueada").setValue(false);

        let chk: any = document.querySelector("#chkBloqueada");
        if (chk != undefined) chk.bootstrapToggle("off");

        break;
    }
  }



  public v_Select_Cuenta(event: any): void {
   
    this.CuentaPadre = "";
    this.val.Get("txtCuentaPadre").setValue("");
  }



  public v_Bloqueada(event: any): void {
    this.val.Get("chkBloqueada").setValue(event.target.checked);
  }

  public v_Nivel(event: any): void {

    let value: string = event.target.value;

    switch (value) {

      case "1":
        this.CuentaPadre = "";
        this.Mascara = "9";
        break;

      case "2":
        this.CuentaPadre = "0";
        this.Mascara = "0";
        break;

      case "3":
        this.CuentaPadre = "00";
        this.Mascara = "0";
        break;

      case "4":
        this.CuentaPadre = "000";
        this.Mascara = "0";
        break;

      case "5":
        this.CuentaPadre = "0000-";
        this.Mascara = "00000";
        break;

      case "6":
        this.CuentaPadre = "0000-00000-";
        this.Mascara = "00";
        break;

      case "7":
        this.CuentaPadre = "0000-00000-00-";
        this.Mascara = "00";
        break;
    }

  }



  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

  private v_CargarDatos() : void{

    document.getElementById("btnRefrescar-Cuenta")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );


    
    this.GET.Get().subscribe(
      {
        next : (data) => {
         
          document.getElementById("btnRefrescar-Cuenta")?.removeAttribute("disabled");
          dialogRef.close();
          let _json : any = data;
      
          if (_json["esError"] == 1) {
            this.DIALOG.open(DialogErrorComponent, {
              data: _json["msj"].Mensaje,
            });
          } else {
            let Datos: iDatos[] = _json["d"];

            this.lstCuentaPadre = Datos[0].d;



          }

        },
        error: (err) => {


          document.getElementById("btnRefrescar-Cuenta")?.removeAttribute("disabled");
          dialogRef.close();
        
          this.DIALOG.open(DialogErrorComponent, {
            data: "<b class='error'>" + err.message + "</b>",
          });

        },
        complete : () => {}
      }
    );


    }



  ngOnInit(): void {


    
    //FILTRO CLIENTE
    this.filteredCuentaPadre = this.val.Get("txtCuentaPadre").valueChanges.pipe(
      startWith(""),
      map((value: string) => {
        return this.lstCuentaPadre.filter((option) =>
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
