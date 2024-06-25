import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iIngresoCajaPost } from "src/app/Interface/Contabilidad/i-IngresoCaja-POST";

@Injectable({
    providedIn: 'root',
  })
export class postIngresoCaja{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

 
   GuardarIngresoCaja(d : iIngresoCajaPost) : Observable<string> { 

    return this.http.post<any>(this._Cnx.Url() + "Contabilidad/EjercicioFiscal/Guardar", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });

}

}