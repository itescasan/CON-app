import { Component } from '@angular/core';
import { Validacion } from 'src/SHARED/class/validacion';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistroEjercicioFiscalComponent } from '../registro-ejercicio-fiscal/registro-ejercicio-fiscal.component';
import { PeriodosFiscalComponent } from '../periodos-fiscal/periodos-fiscal.component';
import { FormsModule } from '@angular/forms';

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
  
  constructor(
    private dialog: MatDialog,
  )
  {
    this.val.add("idEjercicioFiscal", "1", "LEN>", "0", "Ejercio_Fiscal", "Ingrese un número de cuenta.");
    this.val.add("idFechaIni", "1", "LEN>", "0", "Fecha", "Seleccione un nivel.");
    this.val.add("idFechaFin", "1", "LEN>", "0", "Fecha", "Ingrese la descripción de la cuenta.");
    this.val.add("cmbGrupoCP", "1", "LEN>=", "0", "Clase Periodo", "");
    this.val.add("idNperiodos", "1", "LEN>=", "0", "N° Periodo", "");
    this.val.add("cmbGrupoA", "1", "LEN>", "0", "Cuenta Acumulada", "Seleccione una Cuenta.");
    this.val.add("cmbGrupoCtaP", "1", "LEN>", "0", "Cuenta Periodo","Seleccione una Cuenta.");
    this.val.add("chkBloqueada", "1", "LEN>", "0", "Bloqueada", "");
  }
  

ngOnInit() : void{

  let lstcheckbox: any = document.querySelectorAll("input[type='checkbox']");
    lstcheckbox.forEach((f: any) => {
      f.bootstrapToggle();
    });
 
  }

 public v_Editar(e : any) : void{

    let dialogRef: MatDialogRef<PeriodosFiscalComponent> = this.dialog.open(PeriodosFiscalComponent,
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
