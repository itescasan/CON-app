import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings, scaleInCenter, scaleOutCenter } from 'igniteui-angular';
import { iAuxiliarCuenta } from 'src/app/Interface/Contabilidad/i-Auxiliar-Cuenta';
import { iBodega } from 'src/app/Interface/Inventario/i-Bodega';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';

@Component({
  selector: 'app-auxiliar-cuenta',
  templateUrl: './auxiliar-cuenta.component.html',
  styleUrls: ['./auxiliar-cuenta.component.scss']
})
export class AuxiliarCuentaComponent {
  public val = new Validacion();
  displayedColumns: string[] = ["col1"];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  public lstAuxiliar : MatTableDataSource<iAuxiliarCuenta>;

  lstBodega: iBodega[] = [];

  public overlaySettings: OverlaySettings = {};


  constructor(private cFunciones : Funciones
    ) {
  
      this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Seleccione una fecha de inicio.");
      this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Final", "Seleccione una fecha final.");
      this.val.add("txtBodega", "1", "LEN>=", "0", "Bodega", "");
      this.val.add("txtCuenta-Asiento", "1", "LEN>=", "0", "Cuenta", "");
      
      this.val.Get("txtFecha1").setValue(this.cFunciones.DateFormat((new Date(this.cFunciones.FechaServer.getFullYear(), this.cFunciones.FechaServer.getMonth() -1, 1)), "yyyy-MM-dd"));
      this.val.Get("txtFecha2").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServer, "yyyy-MM-dd"));
  
      this.v_CargarDatos();
  
    }
  
  


    

  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  public v_Select_Bodega(event: any) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.val.Get("txtBodega").setValue([event.added]);
    }
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let _Item: iBodega = this.cmbBodega.dropdown.focusedItem.value;
      this.cmbBodega.setSelectedItem(_Item.Codigo);
      this.val.Get("txtBodega").setValue([_Item.Codigo]);

    }
  }


  


  public v_CargarDatos(): void {



  }


  public v_Filtrar(event : any){
    this.lstAuxiliar.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }



  ngOnInit(): void {


    this.overlaySettings = {};

    if (window.innerWidth <= 992) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }

  }


  ngAfterViewInit(): void{
    ///CAMBIO DE FOCO
    this.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.val.addFocus("txtFecha2", "txtBodega", undefined);
    this.val.addFocus("txtBodega", "txtCuenta-Asiento", undefined);
    this.val.addFocus("txtCuenta-Asiento", "btnRefrescar-Auxiliar", "click");

    }
    

}
