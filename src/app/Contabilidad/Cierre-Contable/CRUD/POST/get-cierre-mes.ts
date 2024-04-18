import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
})
export class getCierreMes {

    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor() {

        this.http = new HttpClient(new HttpXhrBackend({
            build: () => new XMLHttpRequest()
        }));

    }


    Comparar(Modulo: string, NoDocumento : string, CuentaContable : string, Fecha : String, esCordoba : boolean): Observable<string> {

        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/CierreMensual/ModuloVSContabilidad?Modulo=" +  Modulo + "&NoDocumento=" + NoDocumento + "&CuentaContable=" + CuentaContable + "&Fecha=" + Fecha + "&esCordoba=" + esCordoba);
    }


}