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
import { iGrupo } from 'src/app/Interface/i-Grupo';

@Component({
  selector: 'app-catalogo-cuenta',
  templateUrl: './catalogo-cuenta.component.html',
  styleUrls: ['./catalogo-cuenta.component.scss']
})
export class CatalogoCuentaComponent {

  public val = new Validacion();
  public esModal: boolean = false;

  public Mascara: string = "";
  public Prefix: string = "";

  private iDatos: iDatos[] = [];

  lstCuentaPadre: iCuenta[] = [];
  filteredCuentaPadre: Observable<iCuenta[]> | undefined;

  lstGrupos: iGrupo[] = [];


  constructor(private DIALOG: MatDialog, private GET: getCuentaContable) {
    
    this.val.add("cmbNivel", "1", "LEN>", "0", "Nivel", "Seleccione un nivel.");
    this.val.add("cmbGrupo", "1", "LEN>", "0", "Group", "Seleccione un grupo.");
    this.val.add("txtCuenta", "1", "LEN>", "0", "Cuenta", "Ingrese un número de cuenta.");
    this.val.add("txtDescripcion", "1", "LEN>", "0", "Descripción", "Ingrese la descripción de la cuenta.");
    this.val.add("txtCuentaPadre", "1", "LEN>=", "0", "Cuenta Padre", "");
    this.val.add("txtDescripcionPadre", "1", "LEN>=", "0", "Descripcion Cuenta Padre", "");
    this.val.add("cmbClase", "1", "LEN>", "0", "Clase", "Seleccione una clase.");
    this.val.add("cmbNaturaleza", "1", "LEN>", "0", "Naturaleza Cuenta", "Seleccione la naturaleza de la cuenta.");
    this.val.add("chkBloqueada", "1", "LEN>", "0", "Bloqueada", "");

    
    this.v_Evento("Iniciar");
  }




  public v_Evento(e: string): void {
    switch (e) {
      case "Iniciar":
        this.v_Evento("Limpiar");
        this.v_CargarDatos();
        this.esModal = false;
        break;

      case "Limpiar":

        this.Mascara = "";
        this.lstCuentaPadre = [];


        this.val.Get("cmbNivel").setValue("1");
        this.val.Get("cmbGrupo").setValue(this.lstGrupos[0]?.IdGrupo);
        this.val.Get("txtCuenta").setValue();
        this.val.Get("txtDescripcion").setValue("");
        this.val.Get("txtCuentaPadre").setValue("");
        this.val.Get("txtDescripcionPadre").setValue("");
        this.val.Get("cmbClase").setValue("");
        this.val.Get("cmbNaturaleza").setValue("");
        this.val.Get("chkBloqueada").setValue(false);

        

        this.val.Get("txtCuenta").disable();
        this.val.Get("txtDescripcion").disable();
        this.val.Get("txtCuentaPadre").disable();
        this.val.Get("txtDescripcionPadre").disable();

        let chk: any = document.querySelector("#chkBloqueada");
        if (chk != undefined) chk.bootstrapToggle("off");

        break;
    }
  }



  public v_Select_Cuenta(event: any): void {

    let i_Cuenta: iCuenta = this.lstCuentaPadre.find(f => f.CuentaContable == event.option.value)!;

    this.Prefix = i_Cuenta.CuentaContable + (i_Cuenta.Nivel>= 5 ? "-" : "") ;
    this.val.Get("txtDescripcionPadre").setValue(i_Cuenta.NombreCuenta);

    this.val.Get("txtCuenta").setValue("");
    this.val.Get("txtDescripcion").setValue("");

    this.val.Get("txtCuenta").enable();
    this.val.Get("txtDescripcion").enable();
  }



  public v_Bloqueada(event: any): void {
    this.val.Get("chkBloqueada").setValue(event.target.checked);
  }

  public v_Nivel(event: any): void {

    let value: string = event.target.value;

    
    this.Prefix = "";
    this.val.Get("txtCuenta").setValue("");
    this.val.Get("txtDescripcion").setValue("");
    this.val.Get("txtCuentaPadre").setValue("");
    this.val.Get("txtDescripcionPadre").setValue("");
    
    this.v_Filtrar_Cuentas(value, this.val.Get("cmbGrupo").value);


    switch (value) {

      case "1":
        this.Mascara = "0";
        break;

      case "2":
        this.Mascara = "0";
        break;

      case "3":
        this.Mascara = "0";
        break;

      case "4":
        this.Mascara = "0";
        break;

      case "5":
        this.Mascara = "00";
        break;

      case "6":
        this.Mascara = "00";
        break;

      case "7":
        this.Mascara = "00";
        break;
    }

  }


  public v_Grupo(event : any) : void{

   
 
    this.v_Filtrar_Cuentas(this.val.Get("cmbNivel").value,  event.target.value);
  }

  private v_Filtrar_Cuentas(nivel : string, grupo : string){

    this.lstCuentaPadre = [];
    

    
    let Reg: iCuenta[] = this.iDatos.find(f => f.Nombre == "CUENTAS")?.d;
    this.lstCuentaPadre = Reg.filter(f => f.Nivel == (Number(nivel) - 1) && f.ClaseCuenta == "G" && f.IdGrupo == Number(grupo));


    this.val.Get("txtCuenta").setValue("");
    this.val.Get("txtDescripcion").setValue("");
    this.val.Get("txtCuentaPadre").setValue("");
    this.val.Get("txtDescripcionPadre").setValue("");

    if (nivel != "1") {
      this.val.Get("txtCuenta").disable();
      this.val.Get("txtDescripcion").disable();
      this.val.Get("txtCuentaPadre").enable();
    }
    else {
      this.val.Get("txtCuenta").enable();
      this.val.Get("txtDescripcion").enable();
      this.val.Get("txtCuentaPadre").disable();
    }



   
  }



  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

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

          document.getElementById("btnRefrescar-Cuenta")?.removeAttribute("disabled");
          dialogRef.close();
          let _json: any = data;

          if (_json["esError"] == 1) {
            this.DIALOG.open(DialogErrorComponent, {
              data: _json["msj"].Mensaje,
            });
          } else {

            this.iDatos = _json["d"];
            this.lstGrupos = this.iDatos.find(f => f.Nombre == "GRUPOS")?.d;

         
            if(this.val.Get("cmbGrupo").value == undefined) this.val.Get("cmbGrupo").setValue(this.lstGrupos[0]?.IdGrupo);



          }

        },
        error: (err) => {


          document.getElementById("btnRefrescar-Cuenta")?.removeAttribute("disabled");
          dialogRef.close();

          this.DIALOG.open(DialogErrorComponent, {
            data: "<b class='error'>" + err.message + "</b>",
          });

        },
        complete: () => { }
      }
    );


  }



  ngOnInit(): void {


     ///CAMBIO DE FOCO
     this.val.addFocus("cmbNivel", "cmbClase", undefined);
     this.val.addFocus("cmbClase", "txtCuentaPadre", undefined);
     this.val.addFocus("txtCuentaPadre", "txtCuenta", undefined);
     this.val.addFocus("txtCuenta", "txtDescripcion", undefined);
     this.val.addFocus("txtDescripcion", "cmbClase", undefined);
     this.val.addFocus("cmbClase", "cmbNaturaleza", undefined);
     this.val.addFocus("cmbNaturaleza", "btnGuardarCuenta", "click");



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
