import { Component, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Validacion } from '../../class/validacion';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import { Funciones } from '../../class/cls_Funciones';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-input',
  imports: [ ReactiveFormsModule, FormsModule, MatIcon],
  templateUrl: './dialog-input.component.html',
  styleUrl: './dialog-input.component.scss'
})
export class DialogInputComponent {

  public retorno: string = "0";
  public textBoton1: string = "";
  public textBoton2: string = "";
  public value : string = "";
  public val = new Validacion();
  public MostrarCerrar : boolean = true;
  public placeholder : string = "";
  public label : string = "";

  constructor(private cFunciones: Funciones, sanitizer: DomSanitizer, public hostElement: ElementRef, public dialogRef: MatDialogRef<DialogInputComponent>) {
    this.val.add("txtInput-dialog", "1", "LEN>", "0", "Codigo Confirmacion", "Ingrese le codigo que se le envio al correo.");

  }

  public v_Confirmar() {



    this.val.EsValido();


    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }


    this.dialogRef.close();
    this.retorno = "1";

  }



  public v_Cancelar() {
    this.dialogRef.close();
    this.retorno = "0";

  }

  public V_Cerrar() {
    this.dialogRef.close();
    this.retorno = "-1";

  }

  public Set_StyleBtn1(style: string) {
    document.getElementById("btn-confirmar-1-escasan-dialog")?.setAttribute("style", style);
  }

  public Set_StyleBtn2(style: string) {
    document.getElementById("btn-confirmar-2-escasan-dialog")?.setAttribute("style", style);
  }


}
