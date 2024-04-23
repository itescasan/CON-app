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


    Comparar(Nivel : number, Tabla: string, CodBodega : string, TipoDoc : string, CodConfig : string, NoDocumento : string, Fecha : String, esCordoba : boolean): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/CierreMensual/ModuloVSContabilidad?Nivel=" + Nivel + "&Tabla=" +  Tabla + "&CodBodega=" + CodBodega + "&TipoDoc=" + TipoDoc + "&CodConfig=" + CodConfig + "&NoDocumento=" + NoDocumento + "&Fecha=" + Fecha + "&esCordoba=" + esCordoba);
    }


}