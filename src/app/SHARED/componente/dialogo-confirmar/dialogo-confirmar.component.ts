import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dialogo-confirmar',
  templateUrl: './dialogo-confirmar.component.html',
  styleUrls: ['./dialogo-confirmar.component.scss']
})
export class DialogoConfirmarComponent {

  public retorno: string="0";
  public mensaje: any;
  public textBoton1 : string ="";
  public textBoton2 : string ="";
  public MostrarCerrar : boolean = false;


  constructor(private sanitizer: DomSanitizer, public hostElement: ElementRef, public dialogRef: MatDialogRef<DialogoConfirmarComponent>) { }

  public V_Cerrar(){
    this.dialogRef.close();
    this.retorno="-1";
    
  }

  public v_Confirmar(){
    this.dialogRef.close();
    this.retorno="1";
    
  }

  public v_Cancelar(){
    this.dialogRef.close();
    this.retorno="0";

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
