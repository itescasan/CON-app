import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
})
export class getAuxiliarCuenta {

    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor() {

        this.http = new HttpClient(new HttpXhrBackend({
            build: () => new XMLHttpRequest()
        }));

    }

    public Get(Fecha1: Date, Fecha2: Date, CodBodega: string, Cuenta: string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AuxiliarContable/Get?Fecha1=" + Fecha1 + "&Fecha2=" + Fecha2 + "&CodBodega=" + CodBodega + "&Cuenta=" + Cuenta);
    }


    public GetAsiento(NoDoc: string, Serie: string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AuxiliarContable/GetAsiento?NoDoc=" + NoDoc + "&Serie=" + Serie);
    }


}