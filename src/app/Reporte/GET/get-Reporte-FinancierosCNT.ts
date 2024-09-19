import { DecimalPipe } from "@angular/common";
import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";


@Injectable({
    providedIn: 'root',
  })
export class getReporteFinanciero{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }
    

    public GetBalanceSituacionFinanciera(EsMonedaLocal : Int16Array, Fecha1: String, Fecha2: String): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/BalanceSituacionFinanciera?Moneda=" + EsMonedaLocal + "&FechaInicial=" + Fecha1 + "&FechaFinal=" + Fecha2);
    }


    public GetComprobantes(Fecha1: String, CodBodega: String, TipoDocumento: String, NoAsiento: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/Comprobantes?FechaInicial=" + Fecha1 + "&CodBodega=" + CodBodega + "&TipoDocumento=" + TipoDocumento + "&NoAsiento=" + NoAsiento + "&Moneda=" + EsMonedaLocal);
    }    

    public GetComprobantes2(NoAsiento: String, Fecha1: String, Concepto: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/Comprobantes2?NoAsiento=" + NoAsiento + "&FechaInicial=" + Fecha1 + "&Concepto=" + Concepto + "&Moneda=" + EsMonedaLocal);
    }

    public Datos() : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Inventario/Bodega/Get");
     }

     public DatosT() : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/TipoComprobante/Get");
     }

     public GetAsientosContables(Fecha1: String): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AsientosContables/Get?Fecha=" + Fecha1);
    }

     public GetDiferencias(Fecha1: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/DiferenciasCXCvsCONT?FechaInicial=" + Fecha1 + "&Moneda=" + EsMonedaLocal);
    }
    
     public GetVentasBolsaAgropecuaria(Fecha1: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/ReporteVentasBolsaAgropecuaria?FechaInicial=" + Fecha1 + "&Moneda=" + EsMonedaLocal);
    }

    public DatosCC() : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/CuentasContables/Get");
     }

     public DatosCentroCosto() : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/CentroCosto/Get");
     }

    public GetAuxiliaresContables(Fecha1: String, Fecha2: String, CInicial: String, CFinal: String, CentroCosto: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/AuxiliaresContables?FechaInicial=" + Fecha1 + "&FechaFinal=" + Fecha2 + "&CCInicial=" + CInicial + "&CCFinal=" + CFinal + "&CentroCosto=" + CentroCosto + "&Moneda=" + EsMonedaLocal);
    }

    public GetCreditoFiscalIva(Fecha1: String, Fecha2: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/ReporteCreditoFiscalIva?FechaInicial=" + Fecha1 + "&FechaFinal=" + Fecha2 + "&Moneda=" + EsMonedaLocal);
    }

}