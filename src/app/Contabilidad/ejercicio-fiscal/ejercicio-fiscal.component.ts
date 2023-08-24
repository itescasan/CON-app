import { Component } from '@angular/core';
import { Validacion } from 'src/SHARED/class/validacion';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ejercicio-fiscal',
  templateUrl: './ejercicio-fiscal.component.html',
  styleUrls: ['./ejercicio-fiscal.component.scss']
})
export class EjercicioFiscalComponent {
  
  public val = new Validacion();
  
  constructor(
    private dialog: MatDialog,
  )
  {
    this.val.add("txtCuenta", "1", "LEN>", "0", "Cuenta", "Ingrese un número de cuenta.");
    this.val.add("cmbNivel", "1", "LEN>", "0", "Nivel", "Seleccione un nivel.");
    this.val.add("txtDescripcion", "1", "LEN>", "0", "Descripción", "Ingrese la descripción de la cuenta.");
    this.val.add("txtCuentaPadre", "1", "LEN>=", "0", "Cuenta Padre", "");
    this.val.add("txtDescripcionPadre", "1", "LEN>=", "0", "Descripcion Cuenta Padre", "");
    this.val.add("cmbGrupo", "1", "LEN>", "0", "Group", "Seleccione un grupo.");
    this.val.add("cmbClase", "1", "LEN>", "0", "Clase", "Seleccione una clase.");
    this.val.add("chkBloqueada", "1", "LEN>", "0", "Bloqueada","");    

  }
  

ngOnInit() : void{

  let lstcheckbox: any = document.querySelectorAll("input[type='checkbox']");
    lstcheckbox.forEach((f: any) => {
      f.bootstrapToggle();
    });
 
  }

 public v_Editar(e : any) : void{

    let dialogRef: MatDialogRef<MatDialog> = this.dialog.open(MatDialog,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "",
        height:  window.innerWidth < 992 ? "100%" : "80%",
        width:  window.innerWidth < 992 ? "100%" : "60%",
        disableClose: true
      }
    );    
       
    dialogRef.afterOpened().subscribe(s =>{
      dialogRef.componentInstance.esModal = true;
    });
  }
  

}
