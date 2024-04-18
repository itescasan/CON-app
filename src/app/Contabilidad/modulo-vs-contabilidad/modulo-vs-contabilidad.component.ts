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
  public Modulo: string = "";
  public NoDocumento: string = "";
  private CuentaContable: string = "";

  private AntModulo: string = "";
  private AntNoDocumento: string = "";
  private AntCuentaContable: string = "";
  private SoloDif: boolean = false;


  public lst: MatTableDataSource<iModuloVSContabilidad>;
  private tempDatos : iModuloVSContabilidad[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  displayedColumns: string[] = ["col1"];


  constructor(private cFunciones: Funciones, private GET: getCierreMes
  ) {

    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Seleccione una moneda.");
    this.val.add("txtBuscar-modulo-vs-contabilidad", "1", "LEN>=", "0", "Buscar", "");
    this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));
    this.val.Get("cmbMoneda").setValue(true);


  }

  V_Navegar(det: iModuloVSContabilidad, evento: string) {


    if (evento == "Siguiente") {
      this.AntModulo = this.Modulo;
      this.AntNoDocumento = this.NoDocumento;
      this.CuentaContable = this.CuentaContable;

      this.Modulo = det.Tabla;
      this.NoDocumento = det.NoDocumento;
      this.CuentaContable = det.CuentaContable;
    }

    if (evento == "Atras") {

      if (this.Modulo != this.AntModulo || this.NoDocumento != this.AntNoDocumento || this.CuentaContable != this.AntCuentaContable) {
        this.Modulo = this.AntModulo;
        this.NoDocumento = this.AntNoDocumento;
        this.CuentaContable = this.AntCuentaContable;

      }
      else {
        if (this.Modulo == this.AntModulo) {
          this.Modulo = "";
          this.AntModulo = "";
        }

        if (this.NoDocumento == this.AntNoDocumento) {
          this.NoDocumento = "";
          this.AntNoDocumento = "";
        }

        if (this.CuentaContable == this.AntCuentaContable) {
          this.CuentaContable = "";
          this.AntCuentaContable = "";
        }
      }


    }







    this.V_Comparar();
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


    this.GET.Comparar(this.Modulo, this.NoDocumento, this.CuentaContable, this.cFunciones.DateFormat(this.val.Get("txtFecha").value, "yyyy-MM-dd"), this.val.Get("cmbMoneda").value).subscribe(
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

            this.tempDatos = Datos.d;

            if (this.SoloDif) {
              this.lst = new MatTableDataSource(this.tempDatos.filter((f : any) => f.Saldo != 0 ));
            }
            else{
              this.lst = new MatTableDataSource(this.tempDatos);
            }

            
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


  public V_TipoSaldo(event: any): void {
    this.SoloDif = !this.SoloDif;


    setTimeout(()=>{                          
      if (this.SoloDif) {
        this.lst = new MatTableDataSource(this.tempDatos.filter((f : any) => f.Saldo != 0 ));
      }
      else{
        this.lst = new MatTableDataSource(this.tempDatos);
      }

      this.lst.paginator = this.paginator;
  }, 200);


    
    
  }

  public v_Filtrar(event: any) {
    this.lst.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }



  private ngAfterViewInit() {



    ///CAMBIO DE FOCO
    this.val.addFocus("txtFecha", "cmbMoneda", undefined);
    this.val.addFocus("cmbMoneda", "btn-Modulo-VS-Contabilidad", "click");



    //HABILITANDO CHECKBOK POR PROBLEMAS DE VIZUALIZACION
    let lstcheckbox: any = document.querySelectorAll("input[type='checkbox']");
    lstcheckbox.forEach((f: any) => {
      f.bootstrapToggle();
    });

  }



}
