import { Component } from '@angular/core';
import { CatalogoCuentaComponent } from '../nuevo-catalogo-cuenta/catalogo-cuenta.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Validacion } from 'src/SHARED/class/validacion';

@Component({
  selector: 'app-registro-catalogo-cuenta',
  templateUrl: './registro-catalogo-cuenta.component.html',
  styleUrls: ['./registro-catalogo-cuenta.component.scss']
})
export class RegistroCatalogoCuentaComponent {

  public val = new Validacion();

  constructor(
    private dialog: MatDialog,
  ) {
    this.val.add("txtBuscar-Cuenta", "1", "LEN>=", "0", "Buscar", "");
  }


  public v_Editar(e : any) : void{

    let dialogRef: MatDialogRef<CatalogoCuentaComponent> = this.dialog.open(
      CatalogoCuentaComponent,
      {
        panelClass: window.innerWidth < 576 ? "escasan-dialog-full" : "",
        //height:  window.innerWidth < 992 ? "100%" : "80%",
        //width:  window.innerWidth < 992 ? "100%" : "60%",
        disableClose: true
      }
    );
    
       
    dialogRef.afterOpened().subscribe(s =>{
      dialogRef.componentInstance.esModal = true;
    });

   

  }

}
