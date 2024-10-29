import { DatePipe, formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';
import { getServidor } from '../GET/get-servidor';
import { MatDialog } from '@angular/material/dialog';
import { iPerfil } from '../interface/i-Perfiles';

@Injectable({
  providedIn: 'root',
})
export class Funciones {

  private _TiempoDesconexion : number = 0;

  public FechaServer: Date;

  public TiempoDesconexion() : number{
    return this._TiempoDesconexion;
  }
  

  private datePipe: DatePipe = new DatePipe('en-US');

  public MonedaLocal = "COR";

  public User : string = "";
  public Nombre : string = "";
  public Rol : string = "";
  public TC : number = 0;


  
  public ACCESO: iPerfil[] = [



    /**************************************EJERCICIO FISCAL************************************* */ 

    {IdAcceso:0,  Activo: false, EsMenu: true,  Id:"IdNavEjercicio", Caption: "Ejercicio Fiscal" , MenuPadre: "", Clase : "fa-solid fa-shop fa-lg", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aNewEjercicio", Caption: "Ejercicio Fiscal" , MenuPadre: "IdNavEjercicio", Clase : "fa-solid fa-cash-register", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aRegEjercicio", Caption: "Registros" , MenuPadre: "IdNavEjercicio", Clase : "fa-solid fa-cash-register", Modulo: "CON", Usuario : ""},


    /**************************************CUENTAS CONTABLES************************************* */ 

    {IdAcceso:0,  Activo: false, EsMenu: true,  Id:"IdNavCuentasContables", Caption: "Cuentas Contables" , MenuPadre: "", Clase : "fab fa-cuttlefish fa-lg", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aNewCuenta", Caption: "Nueva Cuenta" , MenuPadre: "IdNavCuentasContables", Clase : "fab fa-cuttlefish fa-lg", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aRegCuenta", Caption: "Registros" , MenuPadre: "IdNavCuentasContables", Clase : "fa-solid fa-table-cells", Modulo: "CON", Usuario : ""},

        
    /**************************************ASIENTO CONTABLE************************************* */ 

    {IdAcceso:0,  Activo: false, EsMenu: true,  Id:"IdNavAsientoContable", Caption: "Asiento Contable" , MenuPadre: "", Clase : "fas fa-book fa-lg", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aNewAsiento", Caption: "Nueva Asiento" , MenuPadre: "IdNavAsientoContable", Clase : "fas fa-book fa-lg", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aRegAsiento", Caption: "Registros" , MenuPadre: "IdNavAsientoContable", Clase : "fa-solid fa-table-cells", Modulo: "CON", Usuario : ""},

        

    /**************************************AUXILIAR CUENTA************************************* */ 

      {IdAcceso:0,  Activo: false, EsMenu: false,  Id:"IdNavAuxiliar", Caption: "Auxiliar Cuenta" , MenuPadre: "", Clase : "fa-solid fa-list-check fa-lg", Modulo: "CON", Usuario : ""},


      
    /**************************************TRANSFERENCIA************************************* */ 

    {IdAcceso:0,  Activo: false, EsMenu: true,  Id:"IdNavTransferencia", Caption: "Transferencias Bancarias" , MenuPadre: "", Clase : "fa-solid fa-building-columns fa-lg", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aNewTransferenciaCuenta", Caption: "Nueva Transferencia (C)" , MenuPadre: "IdNavTransferencia", Clase : "fa-solid fa-money-bill-transfer fa-lg", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aNewTransferenciaSaldo", Caption: "Nueva Transferencia (S)" , MenuPadre: "IdNavTransferencia", Clase : "fa-solid fa-money-bill-trend-up fa-lg", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aRegTransferencia", Caption: "Registros Transferencia" , MenuPadre: "IdNavTransferencia", Clase : "fa-solid fa-table-cells", Modulo: "CON", Usuario : ""},

    
     /**************************************CHEQUE************************************* */ 

     {IdAcceso:0,  Activo: false, EsMenu: true,  Id:"IdNavCheques", Caption: "Cheques" , MenuPadre: "", Clase : "fa-solid fa-money-check-dollar", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aNewCheque", Caption: "Nuevo Cheque (C)" , MenuPadre: "IdNavCheques", Clase : "fa-solid fa-money-check", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aNewChequeSaldo", Caption: "Nuevo Cheque (S)" , MenuPadre: "IdNavCheques", Clase : "fa-solid fa-money-check-dollar", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aRegCheques", Caption: "Registros Cheques" , MenuPadre: "IdNavCheques", Clase : "fa-solid fa-table-list", Modulo: "CON", Usuario : ""},
 
     
      /**************************************CIERRE CONTABLE************************************* */ 

      {IdAcceso:0,  Activo: false, EsMenu: true,  Id:"IdNavCierre", Caption: "Cierre Contable" , MenuPadre: "", Clase : "fa-solid fa-school-lock", Modulo: "CON", Usuario : ""},
      {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aCierreMensual", Caption: "Cierre Mensual" , MenuPadre: "IdNavCierre", Clase : "fa-solid fa-arrow-down-up-lock", Modulo: "CON", Usuario : ""},
      {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aCierreFiscal", Caption: "Cierre Fiscal" , MenuPadre: "IdNavCierre", Clase : "fa-solid fa-building-lock", Modulo: "CON", Usuario : ""},
      {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aModuloVsContabilidad", Caption: "Modulo VS Contabilidad" , MenuPadre: "IdNavCierre", Clase : "fa-solid fa-code-compare", Modulo: "CON", Usuario : ""},


       /**************************************REPORTE************************************* */ 

     {IdAcceso:0,  Activo: false, EsMenu: true,  Id:"IdNavReporte", Caption: "Reporte" , MenuPadre: "", Clase : "fa-solid fa-print", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aBalanzaComprobacion", Caption: "Balanza Comprobación" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aBalanceGeneral", Caption: "Balance General" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aBalanceSituacionFinanciera", Caption: "Balance Situacion Financiera" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aComprobantes", Caption: "Comprobantes" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aDiferencias", Caption: "Diferencias Entre CXC vs Contabilidad" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aVentasBolsaAgropecuaria", Caption: "Ventas Bolsa Agropecuaria" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aAuxiliaresContables", Caption: "Auxiliares Contables" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aCreditoFiscalIva", Caption: "Credito Fiscal Iva" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aRetencionesAlcaldiasForaneas", Caption: "Retenciones 1% Alcadias Foraneas" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aReporteIntegracionGastosAcumulados", Caption: "Reporte Integracion Gastos Acumulados" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aEstadoResultado", Caption: "Estado Resultdo" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aFlujoEfectivo", Caption: "Flujo Efectivo" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aCambioPatrimonio", Caption: "Estado Cambio Patrimonio" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aGastosAcumulados", Caption: "Gastos Acumulados" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aGastosCCosto", Caption: "Gastos por Centro Costo" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aLibroDiario", Caption: "Libro Diario" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aLibroMayor", Caption: "Libro Mayor" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aVentasAlcaldia", Caption: "Ventas Alcaldia" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aVentasImpuestos", Caption: "Ventas Con Impuesto" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
     {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aComparativoGastosMensual", Caption: "Comparativo Gastos Mensual" , MenuPadre: "IdNavReporte", Clase : "fa-solid fa-scale-balanced", Modulo: "CON", Usuario : ""},
    /**************************************ACCESO CAJA CHICA ************************************* */ 

    {IdAcceso:0,  Activo: false, EsMenu: true,  Id:"IdNavAccesoCaja", Caption: "Acceso Caja Chica" , MenuPadre: "", Clase : "fa-solid fa-shop fa-lg", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aAccesoCajaChica", Caption: "Acceso Caja Chica" , MenuPadre: "IdNavAccesoCaja", Clase : "fa-solid fa-cash-register", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aTechoCajaChica", Caption: "Configuración Caja Chica" , MenuPadre: "IdNavAccesoCaja", Clase : "fa-solid fa-cash-register", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aIngresoCaja", Caption: "Ingreso Facturas Caja Chica" , MenuPadre: "IdNavAccesoCaja", Clase : "fa-solid fa-cash-register", Modulo: "CON", Usuario : ""},
    {IdAcceso:0,  Activo: false, EsMenu: false, Id:"aRegistroCaja", Caption: "Registro Caja Chica" , MenuPadre: "IdNavAccesoCaja", Clase : "fa-solid fa-cash-register", Modulo: "CON", Usuario : ""},



  /**************************************CUENTAS POR PAGAR ************************************* */ 
  {IdAcceso:0,  Activo: false, EsMenu: true,  Id:"IdNavGastInt", Caption: "Gastos Interno" , MenuPadre: "", Clase : "fa-solid fa-gear fa-lg", Modulo: "CON", Usuario : ""},
  {IdAcceso:0,  Activo: false, EsMenu: false,  Id:"aGastInt", Caption: "Gastos Interno" , MenuPadre: "IdNavGastInt", Clase : "", Modulo: "CON", Usuario : ""},
  {IdAcceso:0,  Activo: false, EsMenu: false,  Id:"aRegGastInt", Caption: "Registros" , MenuPadre: "IdNavGastInt", Clase : "", Modulo: "CON", Usuario : ""},
 


    
    /**************************************ACCESO WEB**************************************/ 

    {IdAcceso:0,  Activo: false, EsMenu: false,  Id:"idNavAccesoWeb", Caption: "Acceso Web" , MenuPadre: "", Clase : "fa-solid fa-database", Modulo: "CON", Usuario: ""},
  
    

]



  constructor(public GET: getServidor, public DIALOG: MatDialog) {

  }



  public FechaServidor(f  : Date) {
    this.FechaServer = new Date(
      this.DateFormat(f, 'yyyy-MM-dd hh:mm:ss')
    );
  }
  

  public ShortFechaServidor() : string {
    return this.DateFormat(this.FechaServer, 'yyyy-MM-dd')
  }


    
  public SetTiempoDesconexion(n : number) : void{
     this._TiempoDesconexion = n;
  }




  public DateAdd(Tipo: string, Fecha: Date, Num: number): string {
    let f = new Date(Fecha);
    switch (Tipo) {
      case 'Day':
        return this.DateFormat(new Date(f.setDate( f.getDate() + Num)), 'yyyy-MM-dd');
        break;

      case 'Month':
        return this.DateFormat(
          new Date(f.setMonth(f.getMonth() + Num)),
          'yyyy-MM-dd'
        );
        break;

      case 'Year':
        return this.DateFormat(
          new Date(f.setFullYear(f.getFullYear() + Num)),
          'yyyy-MM-dd'
        );
        break;
    }

    return this.DateFormat(f, 'yyyy-MM-dd');
  }

  
  public LastDay(Fecha: Date): string {
    let f = new Date(Fecha.getFullYear(), Fecha.getMonth() + 1);

    return this.DateFormat(f, 'yyyy-MM-dd');
  }

  public DateFormat(fecha: Date, formart: string): string {
    return this.datePipe.transform(fecha, formart)!;
  }



  public NumFormat(valor: number, decimal : string): string {
    return formatNumber(valor, "en-IN",  "1."+decimal+"-"+decimal);
  }


  public Redondeo(valor : number, numDecimal : string) : number{

    valor = Number(valor);
    valor = (Math.round(valor * Math.pow(10, Number(numDecimal))) / Math.pow(10, Number(numDecimal)));

    return  Number(valor);
  }



  public v_Prevent_IsNumber(event : any, tipo : string) : void{

    if(event.key === "Backspace" || event.key === "Enter" || event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key == "ArrowDown" ||
    event.key === "F1" || event.key === "F2" || event.key === "F3" || event.key === "F4" || event.key === "F5" || event.key === "F6" || event.key === "F7" ||
    event.key === "F8" || event.key === "F9" || event.key === "F10" || event.key === "F11" || event.key === "F12") return;

    if(event.key == ",") {
      event.preventDefault();
      return;
    }
    

    if(tipo == "Decimal")
    {
      if((String(event.target.value).includes(".") && event.key == ".")  || ( event.key == "." && event.target.value == "")) {
        event.preventDefault();
        return;
      }
      
      if(String(event.target.value).includes("."))
      {
        let decimal : string[] = String(event.target.value).split(".");
  
        if(isNaN(parseFloat(event.key)) && !isFinite(event.key)){
          event.preventDefault();
          return;
        }
  
      }
      else{

        if(event.key != "." && (String(event.target.value) == ""  && !isFinite(event.key) || String(event.target.value) != "" && isNaN(parseFloat(event.key)))){
          event.preventDefault();
          return;
        }


       
      }

     

    }

    if(tipo == "Entero"){
      if(isNaN(parseFloat(event.key)) && !isFinite(event.key)){
        event.preventDefault();
        return;
      }
    }

   
  }


  

  public MyBrowser() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!(document as any).documentMode == true)) {
      return 'IE';
    } else {
      return 'unknown';
    }
  }


  getBrowserVersion() {
    var userAgent = navigator.userAgent, tem,
      matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    matchTest = matchTest[2] ? [matchTest[1], matchTest[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }

  
  public TamanoPantalla(t: string): number {

    let x: number = 0;
    switch (t) {

      case "sm":
        x = 576
        break;

      case "md":
        x = 768;
        break;

      case "lg":
        x = 992;
        break;
      
      case "xl":
        x = 1200;
        break;


    }


    return x;

  }
}


