import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
})
export class postCierreMes {

    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor() {

        this.http = new HttpClient(new HttpXhrBackend({
            build: () => new XMLHttpRequest()
        }));

    }


    Procesar(Codigo: String, Fecha : String): Observable<string> {

        return this.http.post<any>(this._Cnx.Url() + "Contabilidad/CierreMensual?Codigo=" + Codigo + "&Fecha=" + Fecha, { headers: { 'content-type': 'text/plain' } });

    }


}