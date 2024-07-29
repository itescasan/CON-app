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


    public GetComprobantes(Fecha1: String, Fecha2: String, CodBodega: String, TipoDocumento: String, IdSerie: String, EsMonedaLocal : Int16Array): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/Comprobantes?FechaInicial=" + Fecha1 + "&FechaFinal=" + Fecha2 + "&CodBodega=" + CodBodega + "&TipoDocumento=" + TipoDocumento + "&IdSerie=" + IdSerie + "&Moneda=" + EsMonedaLocal);
    }
    

}