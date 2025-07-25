import { Component, ViewChild } from '@angular/core';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iIngCaja } from 'src/app/Interface/Contabilidad/i-IngresoCaja';
import { getIngresoCaja } from '../CRUD/GET/getIngresoCaja';
import printJS from 'print-js';
import { PDFDocument } from 'pdf-lib';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { postIngresoCaja } from '../CRUD/POST/postIngresoCaja';

@Component({
  selector: 'app-aplicar-caja-chica',  
  templateUrl: './aplicar-caja-chica.component.html',
  styleUrl: './aplicar-caja-chica.component.scss',
  standalone: false
})
export class AplicarCajaChicaComponent {
 public val = new Validacion();
  // displayedColumns: string[] = ["col1"];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
   
 
  public iDatos: iDatos[] = [];

  public lstRegIngCaja : MatTableDataSource<iIngCaja>;
  

  displayedColumns: string[] = ["Nombre_Cuenta","Fecha_Registro","Consecutivo","Usuario","Enviado",'Corregir',"Aplicado","Contabilizado","Correcion","Aplicar", "Imprimir"];

  constructor(private GET: getIngresoCaja, private cFunciones : Funciones, private POST:postIngresoCaja) 
  {
      this.val.add("txtBuscar-Cuenta", "1", "LEN>=", "0", "Buscar", "");
  
      this.v_CargarDatos();
  
    }

    
  public v_CargarDatos(): void {

    document.getElementById("btnRefrescar-RegIngCaja")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.GET.GetRegistro2().subscribe(
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

            let datos : iDatos[] = _json["d"];

            this.lstRegIngCaja = new MatTableDataSource(datos[0].d); 
            this.lstRegIngCaja.paginator = this.paginator;

          
          }

        },
        error: (err) => {

          document.getElementById("btnRefrescar-RegCaja")?.removeAttribute("disabled");

          dialogRef.close();

          if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => { 
          document.getElementById("btnRefrescar-RegCaja")?.removeAttribute("disabled");
          this.lstRegIngCaja.filter = this.val.Get("txtBuscar-Cuenta").value.trim().toLowerCase();
        }
      }
    );

    }

    public v_ImprimirIngCaja(item: iIngCaja) {   

      let i = this.lstRegIngCaja.data.findIndex(f => f.IdIngresoCajaChica == item.IdIngresoCajaChica);

      if (i == -1) return;

      document.getElementById("btnImprimir-IngCaja")?.setAttribute("disabled", "disabled");
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
  
  
      this.GET.GetRptIngCaja(item.IdIngresoCajaChica).subscribe(
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
            document.getElementById("btnImprimir-IngCaja")?.removeAttribute("disabled");
            if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor",
                data: "<b class='error'>" + err.message + "</b>",
              });
            }
  
          },
          complete: () => {
            document.getElementById("btnImprimir-IngCaja")?.removeAttribute("disabled");
  
  
          }
        }
      );  
    }

    
    v_EnviarACorreccion(item: iIngCaja) {
        
        if (item.Corregir == "Pendiente"  ) return;
    
        let i = this.lstRegIngCaja.data.findIndex(f => f.IdIngresoCajaChica == item.IdIngresoCajaChica);
    
        if (i == -1) return;
        let dialogRef: MatDialogRef<DialogoConfirmarComponent> =  this.cFunciones.DIALOG.open(
          DialogoConfirmarComponent,
          {
            disableClose: true
    
          }
        );  

        if (item.Corregir == "Completado") {
          dialogRef.componentInstance.mensaje = "<p class='Bold'>Esta Seguro Enviar Este Reembolso Nuevamente Para Su Correccion?. </p>";
        }else {
          dialogRef.componentInstance.mensaje = "<p class='Bold'>Esta Seguro Enviar Este Reembolso Para Su Correccion?. </p>";
        }
    
       
        dialogRef.componentInstance.textBoton1 = ("ACEPTAR");
        dialogRef.componentInstance.textBoton2 = "CANCELAR";
    
        dialogRef.afterClosed().subscribe(s => {
          if (dialogRef.componentInstance.retorno == "1") {
            this.v_Corregir_IngCaja(item.IdIngresoCajaChica)
          }
        });
           
    
      }
    
      v_Corregir_IngCaja(id : number)  {
          let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
            WaitComponent,
            {
              panelClass: "escasan-dialog-full-blur",
              data: "",
            }
          );
      
          document.getElementById("btnGuardar-IngCaja")?.setAttribute("disabled", "disabled");
      
      
          // let Datos : iIngresoCajaPost = {} as iIngresoCajaPost;
          // Datos.I = this.FILA;
          // Datos.D = det;
      
          this.POST.CorreccionIngCaja(id, this.cFunciones.User).subscribe(
            {
              next: (data) => {
      
                dialogRef.close();
                let _json: any = data;
      
                if (_json["esError"] == 1){
                  if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined){
                    this.cFunciones.DIALOG.open(DialogErrorComponent, {
                      id: "error-servidor-msj",
                      data: _json["msj"].Mensaje,
                    });
                  }
                }
                else {
      
      
                  let Datos: iDatos[] = _json["d"];
                  let msj: string = Datos[0].d;
      
      
                  this.cFunciones.DIALOG.open(DialogErrorComponent, {
                    data: "<p><b class='bold'>" + msj + "</b></p>"
                  });
      
                  this.v_CargarDatos();             
      
                }
      
              },
              error: (err) => {
                dialogRef.close();
      
                document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
                if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                  this.cFunciones.DIALOG.open(DialogErrorComponent, {
                    id: "error-servidor",
                    data: "<b class='error'>" + err.message + "</b>",
                  });
                }
              },
              complete: () => {
                document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
              }
            }
          );
        }

     v_Enviar(item: iIngCaja) {
     
     if (item.Aplicado == true || item.Corregir == "Pendiente") return;
 
     let i = this.lstRegIngCaja.data.findIndex(f => f.IdIngresoCajaChica == item.IdIngresoCajaChica);
 
     if (i == -1) return;
     let dialogRef: MatDialogRef<DialogoConfirmarComponent> =  this.cFunciones.DIALOG.open(
       DialogoConfirmarComponent,
       {
         disableClose: true
 
       }
     );   
 
     dialogRef.componentInstance.mensaje = "<p class='Bold'>Esta Seguro Aplicar Este Reembolso Para Su Contabilizacion?. </p>";
     dialogRef.componentInstance.textBoton1 = ("ACEPTAR");
     dialogRef.componentInstance.textBoton2 = "CANCELAR";
 
     dialogRef.afterClosed().subscribe(s => {
       if (dialogRef.componentInstance.retorno == "1") {
         this.v_Aplicar_IngCaja(item.IdIngresoCajaChica)
       }
     });
        
 
   }
 
   v_Aplicar_IngCaja(id : number)  {
       let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
         WaitComponent,
         {
           panelClass: "escasan-dialog-full-blur",
           data: "",
         }
       );
   
       document.getElementById("btnGuardar-IngCaja")?.setAttribute("disabled", "disabled");
   
   
       // let Datos : iIngresoCajaPost = {} as iIngresoCajaPost;
       // Datos.I = this.FILA;
       // Datos.D = det;
   
       this.POST.AplicarIngCaja(id, this.cFunciones.User).subscribe(
         {
           next: (data) => {
   
             dialogRef.close();
             let _json: any = data;
   
             if (_json["esError"] == 1){
               if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined){
                 this.cFunciones.DIALOG.open(DialogErrorComponent, {
                   id: "error-servidor-msj",
                   data: _json["msj"].Mensaje,
                 });
               }
             }
             else {
   
   
               let Datos: iDatos[] = _json["d"];
               let msj: string = Datos[0].d;
   
   
               this.cFunciones.DIALOG.open(DialogErrorComponent, {
                 data: "<p><b class='bold'>" + msj + "</b></p>"
               });
   
               this.v_CargarDatos();             
   
             }
   
           },
           error: (err) => {
             dialogRef.close();
   
             document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
             if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
               this.cFunciones.DIALOG.open(DialogErrorComponent, {
                 id: "error-servidor",
                 data: "<b class='error'>" + err.message + "</b>",
               });
             }
           },
           complete: () => {
             document.getElementById("btnGuardar-IngCaja")?.removeAttribute("disabled");
           }
         }
       );
     }
 


  

   
    public v_Filtrar(event : any){
      this.lstRegIngCaja.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();      
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
  

 }