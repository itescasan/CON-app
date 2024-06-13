import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iAccesoCaja } from "src/app/Interface/Contabilidad/i-AccesoCajaChica";
@Injectable({
    providedIn: 'root',
  })
export class postAccesoCajaChica{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    GuardarAccesoCajaChica(d : iAccesoCaja[]) : Observable<string> { 
        return this.http.post<any>(this._Cnx.Url() + "Contabilidad/GuardarAccesoCajaChica", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });
    }


}