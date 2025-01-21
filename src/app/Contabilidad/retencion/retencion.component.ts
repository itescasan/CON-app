import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { getTransferencia } from '../Operaciones-bancarias/CRUD/GET/get-Transferencia';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { MatTableDataSource } from '@angular/material/table';

export interface iRet {
  Seleccionar: boolean;
  IdDetRetencion: any;
  Index: number;
  IdRetencion: number;
  Retencion: string;
  Porcentaje: number;
  Documento: string;
  Serie: string;
  TipoDocumento: string;
  Monto: string;
  PorcImpuesto : number;
  TieneImpuesto : boolean;
  CuentaContable : string;
}


@Component({
    selector: 'app-retencion',
    templateUrl: './retencion.component.html',
    styleUrl: './retencion.component.scss',
    standalone: false
})
export class RetencionComponent {

  public lstRetencion = new MatTableDataSource<iRet>;
  displayedColumns: string[] = ["col1"];


  public Doc: any[];
  public NoDocumento: string = "";



  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<RetencionComponent>,
    private cFunciones: Funciones, private GET: getTransferencia, @Inject(MAT_DIALOG_DATA) public data: any[],) {
    this.Doc = data[0];
    this.NoDocumento = data[1];

  }





  public v_BucarRetenciones(): void {


    this.lstRetencion = new MatTableDataSource<iRet>;


    let dialogRef: any = this.cFunciones.DIALOG.getDialogById("wait");


    if (dialogRef == undefined) {
      dialogRef = this.cFunciones.DIALOG.open(
        WaitComponent,
        {
          panelClass: "escasan-dialog-full-blur",
          data: "",
          id: "wait"
        }
      );

    }




    let Docs : string = "";
    this.Doc.forEach(f =>{

      Docs += f.Documento + f.TipoDocumento + ";";

    });


    Docs = Docs.substring(0, Docs.length -1);


    this.GET.BuscarTiposRetenciones(Docs).subscribe(
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
          } else {

            let datos: iDatos[] = _json["d"];

            let i: number = 0;

            datos[1].d.forEach((doc : any) =>{


              datos[0].d.forEach((f: any) => {

                let r: iRet = {} as iRet;
  
                r.IdDetRetencion = "00000000-0000-0000-0000-000000000000";
                r.Seleccionar = false;
                r.Index = i;
                r.IdRetencion = f.IdRetencion;
                r.Retencion = f.Retencion;
                r.Porcentaje = f.Porcentaje;
                r.Documento = doc.NoDocOrigen;
                r.TipoDocumento = doc.TipoDocumentoOrigen;
                r.Serie = doc.Serie;
                r.Monto = "0";
                r.TieneImpuesto = doc.Impuesto == 0 ? false : true;
                r.PorcImpuesto = 0;
                if(r.TieneImpuesto) r.PorcImpuesto = this.cFunciones.Redondeo( doc.Impuesto / doc.d.SubTotal, "2");
                r.CuentaContable = f.CuentaContable;
               
                this.lstRetencion.data.push(r);
  
                i++;
              });

              
            });

            this.lstRetencion.filter = this.NoDocumento;


          }

        },
        error: (err) => {


          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {

          this.lstRetencion._updateChangeSubscription();

        }
      }
    );


  }



  public V_Calcular(i: number): void {




    setTimeout(() => {


      this.lstRetencion.filter = "";


      let ret  = this.lstRetencion.data[i];

      this.lstRetencion.data.forEach(w =>{

       if(ret.IdRetencion == w.IdRetencion && w.Index != i) w.Seleccionar = ret.Seleccionar;

      });


  

      this.Doc.forEach(doc =>{

        this.lstRetencion.data.filter(w=> w.Documento == doc.Documento && w.TipoDocumento == doc.TipoDocumento).forEach(f => {
          if (!f.Seleccionar) {
            f.Monto = "0";
          }
          else {


            let Importe: number = Number(doc.Importe.replaceAll(",", ""));
            let Porc: number = 1 + f.PorcImpuesto;
            let SubTotal: number = this.cFunciones.Redondeo(Importe / Porc, "2");
            let Retencion: number = this.cFunciones.Redondeo(SubTotal * this.cFunciones.Redondeo((f.Porcentaje / 100), "4"), "2");
            f.Monto = this.cFunciones.NumFormat(Retencion, "2");
          }
  
  
        });


      });


      this.lstRetencion.filter = this.NoDocumento;

    
    });





  }


  public v_Cancelar(): void {
    this.dialogRef.close();
  }






}
