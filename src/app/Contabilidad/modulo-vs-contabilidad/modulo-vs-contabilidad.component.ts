import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { getCierreMes } from '../Cierre-Contable/CRUD/POST/get-cierre-mes';
import { iModuloVSContabilidad } from 'src/app/Interface/Contabilidad/I-Modulo-VS-Contabilidad';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { IgxComboComponent, IgxComboModule, IgxDatePickerModule, IgxIconModule } from 'igniteui-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

export interface iMoneda {
  Moneda: string;
  ValorMoneda: boolean;
}


@Component({
    selector: 'app-modulo-vs-contabilidad',
    imports: [FormsModule, ReactiveFormsModule, MatTableModule, CommonModule, MatPaginatorModule, IgxComboModule, MatInputModule, IgxDatePickerModule, IgxIconModule],
    templateUrl: './modulo-vs-contabilidad.component.html',
    styleUrl: './modulo-vs-contabilidad.component.scss'
})
export class ModuloVSContabilidadComponent {

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;

  public val = new Validacion();
  public Nivel: number = 0;
  private Tabla: string = "";
  private CodBodega: string = "";
  private TipoDoc: string = "";
  private CodConfig: string = "";
  private NoDocumento: string = "";
  private SoloDif: boolean = false;



  public lst: MatTableDataSource<iModuloVSContabilidad>;
  private tempDatos: iModuloVSContabilidad[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  displayedColumns: string[] = ["col1"];
  public lstMoneda: iMoneda[] = [{ Moneda: "Cordobas", ValorMoneda: true }, { Moneda: "Dolares", ValorMoneda: false }];

  @ViewChild("cmbMoneda", { static: false })
  public cmbMoneda: IgxComboComponent;


  @ViewChild("datepiker", { static: false })
  public datepiker: any;

  constructor(private cFunciones: Funciones, private GET: getCierreMes
  ) {

    
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Seleccione una fecha.");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Seleccione una moneda.");
    this.val.add("txtBuscar-modulo-vs-contabilidad", "1", "LEN>=", "0", "Buscar", "");

    this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));
    this.val.Get("cmbMoneda").setValue(true);
    this.val.Get("txtBuscar-modulo-vs-contabilidad").setValue("");


    setTimeout(() => {
      this.cmbMoneda?.select([true]);

    });



  }

  public V_Limpiar()
  {
    

    this.Nivel = 0;
    this.Tabla = "";
    this.CodBodega = "";
    this.TipoDoc = "";
    this.CodConfig = "";
    this.NoDocumento = "";
 
    this.val.Get("txtBuscar-modulo-vs-contabilidad").setValue("");

    let chk: any = document.querySelector("#chkSoloDiferencia");
    chk?.bootstrapToggle("on");


    this.lst = new MatTableDataSource<iModuloVSContabilidad>;
    this.tempDatos.splice(0, this.tempDatos.length);
    this.lst.paginator = this.paginator;
    this.lst.filter = "";


  }
  V_Navegar(det: iModuloVSContabilidad, evento: string) {


    if (evento == "Siguiente") {
      this.Nivel += 1;
    }
    else {
      this.Nivel -= 1;
    }

    this.Tabla = "";
    this.CodBodega = "";
    this.TipoDoc = "";
    this.CodConfig = "";
    this.NoDocumento = "";


    switch (this.Nivel) {
      case 1:
        this.Tabla = det.Tabla;
        break;
      case 2:
        this.Tabla = det.Tabla;
        this.CodBodega = det.CodigoBodega;
        break;
      case 3:
        this.Tabla = det.Tabla;
        this.CodBodega = det.CodigoBodega;
        this.TipoDoc = det.TipoDoc;
        this.CodConfig = det.CodConfig;
        break;
      case 4:
        this.NoDocumento = det.NoDocumento;
        break;
        
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



    this.GET.Comparar(this.Nivel, this.Tabla, this.CodBodega, this.TipoDoc, this.CodConfig, this.NoDocumento, this.cFunciones.DateFormat(this.val.Get("txtFecha").value, "yyyy-MM-dd"), this.cmbMoneda.value[0]).subscribe(
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
              this.lst = new MatTableDataSource(this.tempDatos.filter((f: any) => f.Saldo != 0));
            }
            else {
              this.lst = new MatTableDataSource(this.tempDatos);
            }


            this.lst.paginator = this.paginator;

            this.lst.filter = this.val.Get("txtBuscar-modulo-vs-contabilidad").value.trim().toLowerCase();

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
    this.SoloDif = !event.target.checked;

    setTimeout(() => {
      if (this.SoloDif) {
        this.lst = new MatTableDataSource(this.tempDatos.filter((f: any) => f.Saldo != 0));
      }
      else {
        this.lst = new MatTableDataSource(this.tempDatos);
      }

      this.lst.paginator = this.paginator;
    }, 200);




  }

  public v_Filtrar(event: any) {
    this.lst.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }





  private ngDoCheck() {


    this.val.Combo(this.lstCmb);


    ///CAMBIO DE FOCO
    this.val.addFocus("txtFecha", "cmbMoneda", undefined);
    this.val.addFocus("cmbMoneda", "btn-Modulo-VS-Contabilidad", "click");

    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";
     




    //HABILITANDO CHECKBOK POR PROBLEMAS DE VIZUALIZACION

    
    let checkbox: any =  document.getElementById("chkSoloDiferencia")

     if(checkbox != undefined)checkbox.bootstrapToggle();


    /*let lstcheckbox: any = document.querySelectorAll("input[type='checkbox']");
    lstcheckbox.forEach((f: any) => {
        f.bootstrapToggle();
    });*/

  }



}
