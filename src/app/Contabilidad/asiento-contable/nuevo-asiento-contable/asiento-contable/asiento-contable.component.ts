import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, startWith } from 'rxjs';
import { getCuentaContable } from 'src/app/Contabilidad/catalogo-cuenta/CRUD/GET/get-CatalogoCuenta';
import { iAsientoDetalle } from 'src/app/Interface/i-Asiento-Detalle';
import { iCuenta } from 'src/app/Interface/i-Cuenta';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';

@Component({
  selector: 'app-asiento-contable',
  templateUrl: './asiento-contable.component.html',
  styleUrls: ['./asiento-contable.component.scss']
})
export class AsientoContableComponent {

  public val = new Validacion();
  public valTabla = new Validacion();

  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iAsientoDetalle>;

  lstCuenta: iCuenta[] = [];
  filteredCuenta: Observable<iCuenta[]> | undefined;

  public esModal: boolean = false;



  constructor(private DIALOG: MatDialog, private GET_CATALOGO: getCuentaContable,  public cFunciones : Funciones) {

    this.val.add("cmbSerie", "1", "LEN>", "0", "Serie", "Seleccione una serie.");
    this.val.add("txtNoAsiento", "1", "LEN>", "0", "No Asiento", "No se ha configurado en número de asiento.");
    this.val.add("cmbBodega", "1", "LEN>", "0", "Bodega", "Seleccione una bodega.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Ingrese una fecha valida.");
    this.val.add("txtReferencia", "1", "LEN>", "0", "Referencia", "Ingrese una referencia.");
    this.val.add("txtObservaciones", "1", "LEN>", "0", "Observaciones", "Ingrese una observacion.");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Seleccione una moneda.");
    this.val.add("TxtTC", "1", "LEN>", "0", "Tasa Cambio", "No se ha configurado el tipo de cambio.");
    
    
    this.valTabla.add("txtCuenta1", "1", "LEN>", "0", "", "")
      
    
    this.v_Evento("Iniciar");
  }




  public v_Evento(e: string): void {
    switch (e) {
      case "Iniciar":
        this.v_Evento("Limpiar");
        this.v_CargarDatos();
        this.esModal = false;
        break;

      case "Limpiar":

        this.val.Get("cmbSerie").setValue("");
        this.val.Get("txtNoAsiento").setValue("");
        this.val.Get("cmbBodega").setValue("");
        this.val.Get("txtFecha").setValue(this.cFunciones.ShortFechaServidor());
        this.val.Get("txtReferencia").setValue("");
        this.val.Get("txtObservaciones").setValue("");
        this.val.Get("cmbMoneda").setValue("0.0000");
        this.val.Get("TxtTC").setValue("0.0000");

        let NuevaLinea : iAsientoDetalle = {} as iAsientoDetalle;
        this.V_Agregar();

        break;
    }
  }


   //██████████████████████████████████████████TABLA██████████████████████████████████████████████████████


  public v_Select_Cuenta(event: any, det : iAsientoDetalle): void {

    let i_Cuenta: iCuenta = this.lstCuenta.find(f => f.CuentaContable == event.option.value)!;
    det.Descripcion = i_Cuenta.NombreCuenta;
    det.Naturaleza = i_Cuenta.Naturaleza;

    document.getElementById("txtDebito" + det.NoLinea)?.setAttribute("disabled", "disabled");
    document.getElementById("txtCredito" + det.NoLinea)?.setAttribute("disabled", "disabled");

    if(i_Cuenta.Naturaleza == "D")  document.getElementById("txtDebito" + det.NoLinea)?.removeAttribute("disabled");

    if(i_Cuenta.Naturaleza == "C")  document.getElementById("txtCredito" + det.NoLinea)?.removeAttribute("disabled");
  }

  public V_FocusOut(det: iAsientoDetalle): void {
    

    det.Debito = this.cFunciones.NumFormat(Number(det.Debito.replaceAll(",", "")), "2");
    det.DebitoML = this.cFunciones.Redondeo(det.DebitoML, "2");
    det.DebitoMS = this.cFunciones.Redondeo(det.DebitoMS, "2");
    det.Credito = this.cFunciones.NumFormat(Number(det.Credito.replaceAll(",", "")), "2");
    det.CreditoML = this.cFunciones.Redondeo(det.CreditoML, "2");
    det.CreditoMS = this.cFunciones.Redondeo(det.CreditoMS, "2");

  }

  public V_Focus(columna : string, det : iAsientoDetalle)
  {

    if(columna != "NuevaFila")
    {
      if(columna != "Debito/Credito")
      {
        document?.getElementById("txt" +columna + det.NoLinea)?.focus();
      }
      else{
        if(det.Naturaleza == "D") document?.getElementById("txtDebito" + det.NoLinea)?.focus();
        if(det.Naturaleza == "C") document?.getElementById("txtCredito" + det.NoLinea)?.focus();
  
      }
     
    }
    else
    {
     
      let i : number = 1;

      if (this.lstDetalle.data.length > 0) i = Math.max(...this.lstDetalle.data.map(o => o.NoLinea))

      if(det.NoLinea != i) return;

      this.V_Agregar();
    }
    
  }


 //██████████████████████████████████████████POPUP██████████████████████████████████████████████████████

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  public V_Popup(event: MouseEvent, item: iAsientoDetalle): void{
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu!.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }


  V_Agregar() {

    let det : iAsientoDetalle = {} as iAsientoDetalle;
    let i : number = 1;

    if (this.lstDetalle.data.length > 0) i = Math.max(...this.lstDetalle.data.map(o => o.NoLinea)) + 1

    this.valTabla.add("txtCuenta" + i, "1", "LEN>", "0", "", "")

    det.NoLinea = i;
    det.CuentaContable = "";
    det.Debito = "0";
    det.DebitoML = 0;
    det.DebitoMS = 0;
    det.Credito = "0";
    det.CreditoML = 0;
    det.CreditoMS = 0;
    det.Modulo = "CON";
    det.Descripcion = "";
    det.Referencia = "";
    this.lstDetalle.data.push(det);

    this.V_Ordenar(i);

   
  }

  V_Eliminar(item: iAsientoDetalle) {
    let i = this.lstDetalle.data.findIndex(f => f.NoLinea == item.NoLinea);

    if(i == -1) return;

    this.lstDetalle.data.splice(i, 1);
   this.V_Ordenar(-1);

   this.valTabla.del("txtCuenta" + item.NoLinea);


  }

  private V_Ordenar(x : number)
  {

    this.lstDetalle.data = this.lstDetalle.data.sort((a,b) => b.NoLinea - a.NoLinea);

    this.lstDetalle.data = [...this.lstDetalle.data];

    if(x == -1) return;




    setTimeout(()=>{ 
      document?.getElementById("txtCuenta" + x)?.focus();
      document.getElementById("txtDescripcion" + x)?.setAttribute("disabled", "disabled");
      document.getElementById("txtDebito" + x)?.setAttribute("disabled", "disabled");
      document.getElementById("txtCredito" + x)?.setAttribute("disabled", "disabled");

      
      //FILTRO CUENTAS
      this.filteredCuenta = this.valTabla.Get("txtCuenta" + x).valueChanges.pipe(
        startWith(""),
        map((value: string) => {
          return this.lstCuenta.filter((option) =>
            option.Filtro.toLowerCase().includes(
              (value || "").toLowerCase().trimStart()
            )
          );
        })
      );

    }, 0);
   
 
  }




  //██████████████████████████████████████████CARGAR DATOS██████████████████████████████████████████████████████

  public v_CargarDatos(): void {


    document.getElementById("btnRefrescar-Asiento")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );



    this.GET_CATALOGO.Datos().subscribe(
      {
        next: (data) => {


          dialogRef.close();
          let _json: any = data;

          if (_json["esError"] == 1) {
            this.DIALOG.open(DialogErrorComponent, {
              data: _json["msj"].Mensaje,
            });
          } else {

            let datos : iDatos[] = _json["d"];
            this.lstCuenta = datos.find(f => f.Nombre == "CUENTAS")?.d.filter((f : any) => f.ClaseCuenta == "D");

          }

        },
        error: (err) => {


          document.getElementById("btnRefrescar-Asiento")?.removeAttribute("disabled");
          dialogRef.close();

          this.DIALOG.open(DialogErrorComponent, {
            data: "<b class='error'>" + err.message + "</b>",
          });

        },
        complete: () => { document.getElementById("btnRefrescar-Asiento")?.removeAttribute("disabled"); }
      }
    );


  }


  public v_Guardar() : void{

    this.val.EsValido();


    if (this.val.Errores != "") {
      this.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }

   

 


  }



  ngOnInit(): void {


  }

  
}

