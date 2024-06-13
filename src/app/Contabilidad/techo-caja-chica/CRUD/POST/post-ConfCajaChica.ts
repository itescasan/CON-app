import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iConfC } from "src/app/Interface/Contabilidad/i-ConfCaja";

@Injectable({
    providedIn: 'root',
  })
export class postConfCajaChica{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    GuardarTechoCajaChica(d : iConfC[]) : Observable<string> { 
        return this.http.post<any>(this._Cnx.Url() + "Contabilidad/GuardarConfCajaChica", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });
    }


}