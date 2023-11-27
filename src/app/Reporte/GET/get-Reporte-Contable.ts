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


    public GetBalanzaComprobacion(Fecha1: Date, Fecha2: Date, Nivel: number): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/BalanzaComprobacion?FechaInicio=" + Fecha1 + "&FechaFinal=" + Fecha2 + "&Nivel=" + Nivel);
    }


}