import { Component } from '@angular/core';
import { Validacion } from 'src/SHARED/class/validacion';
import * as $ from 'jquery';

@Component({
  selector: 'app-catalogo-cuenta',
  templateUrl: './catalogo-cuenta.component.html',
  styleUrls: ['./catalogo-cuenta.component.scss']
})
export class CatalogoCuentaComponent {

  public val = new Validacion();
  public esModal : boolean = false;
  

  constructor()
  {
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




private v_Iniciar(e : string) : void
{
  switch(e)
  {
    case "Iniciar":
      this.esModal = false;
    break;

    case "Limpiar":
    break;
  }
}

ngOnInit() : void{

  let lstcheckbox: any = document.querySelectorAll("input[type='checkbox']");
    lstcheckbox.forEach((f: any) => {
      f.bootstrapToggle();
    });
 
}

}
