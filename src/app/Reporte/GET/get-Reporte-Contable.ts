import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";


@Injectable({
    providedIn: 'root',
  })
export class getReporteContable{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }


    public GetBalanzaComprobacion(Fecha1: Date, Fecha2: Date, Nivel: number, EsMonedaLocal : boolean): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/BalanzaComprobacion?FechaInicio=" + Fecha1 + "&FechaFinal=" + Fecha2 + "&Nivel=" + Nivel + "&EsMonedaLocal=" + EsMonedaLocal);
    }


    public GetBalanceGeneral(Fecha: String,  EsMonedaLocal : boolean): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/BalanceGeneral?Fecha=" + Fecha + "&EsMonedaLocal=" + EsMonedaLocal);
    }

    public GetEstadoResultado(Fecha: String, Estado: boolean, EsMonedaLocal : boolean): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/EstadoResultado?Fecha=" + Fecha + "&Estado=" + Estado  + "&EsMonedaLocal=" + EsMonedaLocal);
    }


}