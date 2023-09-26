import { Component, ViewChild } from '@angular/core';
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings, scaleInCenter, scaleOutCenter } from 'igniteui-angular';
import { iCuentaBancaria } from 'src/app/Interface/Contabilidad/i-Cuenta-Bancaria';
import { iBodega } from 'src/app/Interface/Inventario/i-Bodega';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.scss']
})
export class TransferenciaComponent {
  public overlaySettings: OverlaySettings = {};
  public val = new Validacion();


  public lstCuentabancaria : iCuentaBancaria[] = [];
  lstBodega: iBodega[] = [];


  constructor(public cFunciones: Funciones) {

    this.val.add("cmbCuenta", "1", "LEN>", "0", "No Cuenta", "Seleccione una serie.");
    this.val.add("txtNombreCuenta", "1", "LEN>", "0", "Nombre Cuenta", "No se ha definido el nombre de la cuenta.");
    this.val.add("txtBanco", "1", "LEN>", "0", "No Cuenta", "No se ha definido el banco.");
    this.val.add("cmbBodega", "1", "LEN>", "0", "Sucursal", "Seleccione una sucursal.");
    this.val.add("txtNoDoc", "1", "LEN>", "0", "No Doc", "No se ha definido el número de consecutivo.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "Ingrese una fecha valida.");
    this.val.add("txtBeneficiario", "1", "LEN>", "0", "Fecha", "No se ha especificado el beneficiario de la transferencia.");
    this.val.add("txtMoneda", "1", "LEN>", "0", "Fecha", "No se ha especificado la moneda de la cuenta.");
    this.val.add("TxtTC", "1", "DEC>", "0", "Fecha", "No se ha configurado el tipo de cambio.");
    this.val.add("txtConcepto", "1", "LEN>", "0", "Concepto", "Ingrese un concepto.");
    this.val.add("chkAnulado", "1", "LEN>", "0", "Anulado", "");


    this.v_Evento("Iniciar");

  }



  
  public v_Evento(e: string): void {
    switch (e) {
      case "Iniciar":
        this.v_Evento("Limpiar");

        break;

      case "Limpiar":

       
        this.val.Get("cmbCuenta").setValue();
        this.val.Get("txtNombreCuenta").setValue("");
        this.val.Get("txtBanco").setValue("");
        this.val.Get("cmbBodega").setValue("");
        this.val.Get("txtNoDoc").setValue("");
        this.val.Get("txtFecha").setValue(this.cFunciones.ShortFechaServidor());
        this.val.Get("txtBeneficiario").setValue("");
        this.val.Get("txtMoneda").setValue("");
        this.val.Get("txtConcepto").setValue("");
        this.val.Get("chkAnulado").setValue(false);


        this.val.Get("txtNombreCuenta").disable();
        this.val.Get("txtBanco").disable();
        this.val.Get("txtNoDoc").disable();
        this.val.Get("txtMoneda").disable();
        this.val.Get("TxtTC").disable();

        let chk: any = document.querySelector("#chkAnulado");
        if (chk != undefined) chk.bootstrapToggle("off");

        break;
    }
  }



  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  public v_Select_Bodega(event: any) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.val.Get("cmbBodega").setValue([event.added]);
    }
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let _Item: iBodega = this.cmbBodega.dropdown.focusedItem.value;
      this.cmbBodega.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbBodega").setValue([_Item.Codigo]);

    }
  }



  public v_Anulado(event: any): void {
    this.val.Get("chkAnulado").setValue(event.target.checked);
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


    let chk: any = document.querySelector("#chkAnulado");
    if (chk != undefined) chk.bootstrapToggle();


    
  }
}
