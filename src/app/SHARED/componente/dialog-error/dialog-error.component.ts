import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-dialog-error',
  templateUrl: './dialog-error.component.html',
  styleUrls: ['./dialog-error.component.scss']
})
export class DialogErrorComponent {

  public str_Error : any;

  constructor(private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<DialogErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {

    this.str_Error = data;
  }
  
  
  
  public SetMensajeHtml(mensaje : string)
  {
    this.str_Error = this.sanitizer.bypassSecurityTrustHtml(mensaje);
  }

  

}
