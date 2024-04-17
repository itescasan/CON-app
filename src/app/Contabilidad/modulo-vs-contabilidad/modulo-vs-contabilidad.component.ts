import { Component, ViewChild } from '@angular/core';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { getCierreMes } from '../Cierre-Contable/CRUD/POST/get-cierre-mes';
import { iModuloVSContabilidad } from 'src/app/Interface/Contabilidad/I-Modulo-VS-Contabilidad';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-modulo-vs-contabilidad',
  templateUrl: './modulo-vs-contabilidad.component.html',
  styleUrl: './modulo-vs-contabilidad.component.scss'
})
export class ModuloVSContabilidadComponent {

  public val = new Validacion();
  private Modulo : string = "";
  private NoDocumento : string = "";
  public lst : MatTableDataSource<iModuloVSContabilidad>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  displayedColumns: string[] = ["col1"];


  constructor(private cFunciones: Funciones, private GET : getCierreMes
  ) {

    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Seleccione una moneda.");
    this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));
    this.val.Get("cmbMoneda").setValue(true);
    
    
  }


  V_Comparar(): void {


    let dialogRef = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
        id: "wait"
      }
    );

    document.getElementById("btn-Modulo-VS-Contabilidad")?.setAttribute("disabled", "disabled");


    this.GET.Comparar( this.Modulo, this.NoDocumento, this.cFunciones.DateFormat(this.val.Get("txtFecha").value, "yyyy-MM-dd"), this.val.Get("cmbMoneda").value).subscribe(
      {
        next: (data) => {

          dialogRef.close();
          let _json: any = data;

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          }
          else {


            let Datos: iDatos = _json["d"];
      
            this.lst = new MatTableDataSource(Datos.d);
            this.lst.paginator = this.paginator;

          }

        },
        error: (err) => {
          dialogRef.close();

          document.getElementById("btn-Modulo-VS-Contabilidad")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          document.getElementById("btn-Modulo-VS-Contabilidad")?.removeAttribute("disabled");
        }
      }
    );
    
  }
  
}
