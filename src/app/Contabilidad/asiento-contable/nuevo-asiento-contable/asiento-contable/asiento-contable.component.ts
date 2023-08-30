import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getCuentaContable } from 'src/app/Contabilidad/ejercicio-fiscal/CRUD/get-CatalogoCuenta';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';

@Component({
  selector: 'app-asiento-contable',
  templateUrl: './asiento-contable.component.html',
  styleUrls: ['./asiento-contable.component.scss']
})
export class AsientoContableComponent {

  public val = new Validacion();
  public esModal: boolean = false;



  public iDatos: iDatos[] = [];


  constructor(private DIALOG: MatDialog, private GET: getCuentaContable,  private cFunciones : Funciones) {

    this.val.add("cmbSerie", "1", "LEN>", "0", "Serie", "Seleccione una serie.");
    this.val.add("txtNoAsiento", "1", "LEN>", "0", "No Asiento", "No se ha configurado en número de asiento.");
    this.val.add("cmbBodega", "1", "LEN>", "0", "Bodega", "Seleccione una bodega.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Ingrese una fecha valida.");
    this.val.add("txtReferencia", "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
    this.val.add("txtObservaciones", "1", "LEN>", "0", "Observaciones", "Ingrese una observacion.");
    this.val.add("txtTC", "1", "LEN>", "0", "Tasa Cambio", "No se ha configurado el tipo de cambio.");
    

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

        this.val.Get("cmbSerie").setValue("");
        this.val.Get("txtNoAsiento").setValue("");
        this.val.Get("cmbBodega").setValue("");
        this.val.Get("txtFecha").setValue(this.cFunciones.ShortFechaServidor());
        this.val.Get("txtReferencia").setValue("");
        this.val.Get("txtObservaciones").setValue("");
        this.val.Get("txtTC").setValue("0.0000");
        
        break;
    }
  }






  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

  public v_CargarDatos(): void {


  }


  public v_Guardar() : void{

    this.val.EsValido();


    if (this.val.Errores != "") {
      this.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }

   

 


  }



  ngOnInit(): void {


  }

  
}
