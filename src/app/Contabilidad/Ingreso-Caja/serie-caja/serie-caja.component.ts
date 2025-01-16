import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Validacion } from '../../../SHARED/class/validacion';
import { Funciones } from '../../../SHARED/class/cls_Funciones';
@Component({
    selector: 'app-serie-caja',
    templateUrl: './serie-caja.component.html',
    styleUrl: './serie-caja.component.scss',
    standalone: false
})
export class DialogInputComponent {
  [x: string]: any;
  public val = new Validacion();  
  public Serie: string;
  public Consecutivo: number;
  public valor : string;
  public mensaje: any;
  public textBoton1 : string ="";
  public textBoton2 : string ="";


  constructor(public cFunciones: Funciones, private sanitizer: DomSanitizer, public hostElement: ElementRef, public dialogRef: MatDialogRef<DialogInputComponent>) 
  { 
    this.val.add("txtMontoCajaChica", "1", "NUM>=", "0", "Monto Caja", "Ingrese Monto Caja.");
    this.val.add("txtSerieCajaChica", "1", "LEN>=", "0", "Serie Caja", "Ingrese Monto Caja.");
    this.val.add("txtConsecutivo", "1", "NUM>=", "0", "Consecutivo Caja", "Ingrese Monto Caja.");
          
  }

  public v_Confirmar(){    
    this.dialogRef.close();
    this.valor = this.cFunciones.NumFormat(Number(this.val.Get("txtMontoCajaChica").value),"2"); 
    this.Serie = this.val.Get("txtSerieCajaChica").value;
    this.Consecutivo = this.val.Get("txtConsecutivo").value;
       
  }

  public v_Cancelar(){
    this.dialogRef.close();
    this.valor = '0.00';
    this.Serie = '';
    this.Consecutivo = 0;
  
  }

  public Set_StyleBtn1(style : string)
  {
    document.getElementById("btn-confirmar-1-escasan-dialog")?.setAttribute("style", style);
  }

  public Set_StyleBtn2(style : string)
  {
    document.getElementById("btn-confirmar-2-escasan-dialog")?.setAttribute("style", style);
  }
  
   public SetMensajeHtml(mensaje : string)
  {
    this.mensaje = this.sanitizer.bypassSecurityTrustHtml(mensaje);
  }

}



