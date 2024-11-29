import { Component, ViewChild } from '@angular/core';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { getReporteContable } from '../GET/get-Reporte-Contable';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { PDFDocument } from 'pdf-lib';
import * as printJS from 'print-js';




@Component({
    selector: 'app-balanza',
    templateUrl: './balanza.component.html',
    styleUrls: ['./balanza.component.scss'],
    standalone: false
})
export class BalanzaComponent {


  public val = new Validacion();

  @ViewChild("datepiker", { static: false })
  public datepiker: any;


  @ViewChild("datepiker2", { static: false })
  public datepiker2: any;

  constructor(private cFunciones: Funciones, private GET: getReporteContable
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Seleccione una fecha de inicio.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Final", "Seleccione una fecha final.");
    this.val.add("cmbNivel", "1", "LEN>", "0", "Nivel", "Seleccione un nivel.");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Selecione una moneda");


    this.val.Get("txtFecha1").setValue(this.cFunciones.DateFormat((new Date(this.cFunciones.FechaServer.getFullYear(), this.cFunciones.FechaServer.getMonth(), 1)), "yyyy-MM-dd"));
    this.val.Get("txtFecha2").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));
    this.val.Get("cmbNivel").setValue(1);
    this.val.Get("cmbMoneda").setValue(true);
  }


  V_Imprimir(): void {


    document.getElementById("btnReporte-Balanza")?.setAttribute("disabled", "disabled");



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




    this.GET.GetBalanzaComprobacion( this.cFunciones.DateFormat(this.val.Get("txtFecha1").value, "yyyy-MM-dd") , this.cFunciones.DateFormat(this.val.Get("txtFecha2").value, "yyyy-MM-dd"), this.val.Get("cmbNivel").value, this.val.Get("cmbMoneda").value).subscribe(
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

            let datos: iDatos = _json["d"];
            this.printPDFS(datos.d);



          }

        },
        error: (err) => {


          dialogRef.close();
          document.getElementById("btnReporte-Balanza")?.removeAttribute("disabled");
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnReporte-Balanza")?.removeAttribute("disabled");


        }
      }
    );


  }


  async printPDFS(datos: any) {



    let byteArray = new Uint8Array(atob(datos).split('').map(char => char.charCodeAt(0)));

    var file = new Blob([byteArray], { type: 'application/pdf' });

    let url = URL.createObjectURL(file);

    let tabOrWindow : any = window.open(url, '_blank');
    tabOrWindow.focus();

    return
    let pdfsToMerge = [url];

  

    if (this.cFunciones.MyBrowser() == "Firefox") {
      let iframe = document.createElement('iframe');
      iframe.id = "frameBalanza";
      iframe.style.display = 'none';

      iframe.src = url
      document.body.appendChild(iframe);
      iframe.onload = () => {
        setTimeout(() => {
          iframe.focus();
          iframe.contentWindow?.print();


        });
      };

    }
    else {
      const mergedPdf = await PDFDocument.create();
      for (const pdfCopyDoc of pdfsToMerge) {
        const pdfBytes = await fetch(pdfCopyDoc).then(res => res.arrayBuffer())

        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page: any) => {
          mergedPdf.addPage(page);
        });
      }


      const mergedPdfFile = await mergedPdf.save();
      this.downloadFile(mergedPdfFile);
    }




  }


  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    printJS({
      printable: url,
      type: 'pdf',
      onPdfOpen: undefined,
      onPrintDialogClose: undefined
    })

  }



  ngDoCheck(): void {
    ///CAMBIO DE FOCO

    this.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.val.addFocus("txtFecha2", "cmbNivel", undefined);
    this.val.addFocus("cmbNivel", "cmbMoneda", undefined);
    this.val.addFocus("cmbMoneda", "btnReporte-Balanza", "click");

    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker2 != undefined) this.datepiker2.mode="dialog";

  }




}
