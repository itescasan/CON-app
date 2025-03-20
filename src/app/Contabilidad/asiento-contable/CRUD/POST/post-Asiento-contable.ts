import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iAsiento } from "src/app/Interface/Contabilidad/i-Asiento";
import { timeout } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class postAsientoContable {

    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor() {

        this.http = new HttpClient(new HttpXhrBackend({
            build: () => new XMLHttpRequest()
        }));

    }


    GuardarAsiento(d: iAsiento): Observable<string> {

        return this.http.post<any>(this._Cnx.Url() + "Contabilidad/AsientoContable/Guardar", JSON.stringify(d), { headers: { 'content-type': 'application/json' } }).pipe(timeout(this._Cnx.Timeout));

    }

    AutorizarAiento(IdAsiento : number, Usuario : string): Observable<string> {

        return this.http.post<any>(this._Cnx.Url() + "Contabilidad/AsientoContable/Autorizar?IdAsiento=" +  IdAsiento + "&Usuario=" + Usuario, { headers: { 'content-type': 'application/text' } }).pipe(timeout(this._Cnx.Timeout));

    }

    
    RevisarAsiento(d: iAsiento): Observable<string> {

        return this.http.post<any>(this._Cnx.Url() + "Contabilidad/AsientoContable/RevisarAsiento", JSON.stringify(d), { headers: { 'content-type': 'application/json' } }).pipe(timeout(this._Cnx.Timeout));

    }

}