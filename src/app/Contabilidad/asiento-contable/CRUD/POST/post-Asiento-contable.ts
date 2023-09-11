import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iAsiento } from "src/app/Interface/Contabilidad/i-Asiento";

@Injectable({
    providedIn: 'root',
  })
export class postAsientoContable{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

 
   GuardarAsiento(d : iAsiento) : Observable<string> { 
    console.log(d)
    return this.http.post<any>(this._Cnx.Url() + "Contabilidad/Asiento/Guardar", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });

}

}