import { DecimalPipe } from "@angular/common";
import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { timeout } from "rxjs";
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
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/BalanceSituacionFinanciera?Moneda=" + EsMonedaLocal + "&FechaInicial=" + Fecha1 + "&FechaFinal=" + Fecha2).pipe(timeout(this._Cnx.Timeout));
    }


    public GetComprobantes(Fecha1: String, CodBodega: String, TipoDocumento: String, NoAsiento: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/Comprobantes?FechaInicial=" + Fecha1 + "&CodBodega=" + CodBodega + "&TipoDocumento=" + TipoDocumento + "&NoAsiento=" + NoAsiento + "&Moneda=" + EsMonedaLocal).pipe(timeout(this._Cnx.Timeout));
    }    

    public GetComprobantes2(NoAsiento: String, Fecha1: String, Concepto: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/Comprobantes2?NoAsiento=" + NoAsiento + "&FechaInicial=" + Fecha1 + "&Concepto=" + Concepto + "&Moneda=" + EsMonedaLocal).pipe(timeout(this._Cnx.Timeout));
    }

    public Datos() : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Inventario/Bodega/Get").pipe(timeout(this._Cnx.Timeout));
     }

     public DatosT() : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/TipoComprobante/Get").pipe(timeout(this._Cnx.Timeout));
     }

     public GetAsientosContables(Fecha1: String): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AsientosContables/Get?Fecha=" + Fecha1).pipe(timeout(this._Cnx.Timeout));
    }

     public GetDiferencias(Fecha1: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/DiferenciasCXCvsCONT?FechaInicial=" + Fecha1 + "&Moneda=" + EsMonedaLocal).pipe(timeout(this._Cnx.Timeout));
    }
    
     public GetVentasBolsaAgropecuaria(Fecha1: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/ReporteVentasBolsaAgropecuaria?FechaInicial=" + Fecha1 + "&Moneda=" + EsMonedaLocal).pipe(timeout(this._Cnx.Timeout));
    }

    public DatosCC() : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/CuentasContables/Get").pipe(timeout(this._Cnx.Timeout));
     }

     public DatosCentroCosto() : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/CentroCosto/Get").pipe(timeout(this._Cnx.Timeout));
     }

    public GetAuxiliaresContables(Fecha1: String, Fecha2: String, CInicial: String, CFinal: String, CentroCosto: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/AuxiliaresContables?FechaInicial=" + Fecha1 + "&FechaFinal=" + Fecha2 + "&CCInicial=" + CInicial + "&CCFinal=" + CFinal + "&CentroCosto=" + CentroCosto + "&Moneda=" + EsMonedaLocal).pipe(timeout(this._Cnx.Timeout));
    }

    public GetCreditoFiscalIva(Fecha1: String, Fecha2: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/ReporteCreditoFiscalIva?FechaInicial=" + Fecha1 + "&FechaFinal=" + Fecha2 + "&Moneda=" + EsMonedaLocal).pipe(timeout(this._Cnx.Timeout));
    }

    public GetRetencionesAlcaldiasForaneas(Fecha1: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/ReporteRetencionesAlcaldiasForaneas?FechaInicial=" + Fecha1 + "&Moneda=" + EsMonedaLocal).pipe(timeout(this._Cnx.Timeout));
    }

    public GetIntegracionGastosAcumulados(Fecha1: String, Rubro: String, CuentaCont: String, CentroCosto: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/ReporteIntegracionGastosAcumulados?FechaInicial=" + Fecha1 + "&Rubro=" + Rubro + "&CuentaContable=" + CuentaCont + "&CentroCosto=" + CentroCosto + "&Moneda=" + EsMonedaLocal).pipe(timeout(this._Cnx.Timeout));
    }

    public GetDiferenciasCXPvsCONT(Fecha1: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/ReporteDiferenciasCXPvsContabilidad?FechaInicial=" + Fecha1 + "&Moneda=" + EsMonedaLocal).pipe(timeout(this._Cnx.Timeout));
    }

    public GetIntegracionGastosAcumuladosVentas(Fecha1: String, CentroCosto: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/ReporteIntegracionGastosAcumuladosVentas?FechaInicial=" + Fecha1 + "&CentroCosto=" + CentroCosto + "&Moneda=" + EsMonedaLocal).pipe(timeout(this._Cnx.Timeout));
    }

    public GetEstadoCambioPatromonio(Fecha1: String, Fecha2: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/EstadoCambioPatrimonio?FechaInicial=" + Fecha1 + "&FechaFinal=" + Fecha2 + "&Moneda=" + EsMonedaLocal).pipe(timeout(this._Cnx.Timeout));
    }

    public DatosGC() : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/GruposCuentas/Get").pipe(timeout(this._Cnx.Timeout));
     }

     public GetCatalogoCuentas(IdGrupoCuentas: Int16Array, Estado: Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/CatalogoCuentas?IdGrupoCuentas=" + IdGrupoCuentas + "&Estado=" + Estado).pipe(timeout(this._Cnx.Timeout));
    }

}