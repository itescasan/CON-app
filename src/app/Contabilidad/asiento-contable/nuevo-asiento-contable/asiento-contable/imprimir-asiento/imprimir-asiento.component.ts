import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Validacion } from 'src/app/SHARED/class/validacion';


@Component({
  selector: 'app-imprimir-asiento',
  imports: [ ReactiveFormsModule, FormsModule, MatIcon],
  templateUrl: './imprimir-asiento.component.html',
  styleUrl: './imprimir-asiento.component.scss'
})
export class ImprimirAsientoComponent {

  @ViewChild("msj", { static: false })
    public msj: HTMLElement;
    public mensaje: any;
  public retorno: string = "0";
  public Consolidado : boolean = false;
  public Unificado : boolean = false;

  constructor(private sanitizer: DomSanitizer, public dialogRef: MatDialogRef<ImprimirAsientoComponent>) { }


  public v_Consolidado()
  {
    this.Consolidado = !this.Consolidado;
  }

  public v_Unificado()
  {
    this.Unificado = !this.Unificado;
  }

  public v_Confirmar(){
    this.dialogRef.close();
    this.retorno="1";
    
  }



  public v_Cancelar(){
    this.dialogRef.close();
    this.retorno="0";

  }

  public V_Cerrar(){
    this.dialogRef.close();
    this.retorno="-1";
    
  }

  public SetMensajeHtml(mensaje : string)
  {

    document.getElementById("msj-confirmar")?.removeAttribute("class");
    this.mensaje = this.sanitizer.bypassSecurityTrustHtml(mensaje);
  }


  
}
