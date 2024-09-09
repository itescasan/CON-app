import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iIngresoCajaPost } from "src/app/Interface/Contabilidad/i-IngresoCaja-POST";
import { iGastoInterno } from "src/app/Proveedor/Interface/i-GastoInterno";

@Injectable({
    providedIn: 'root',
  })
export class postGastoInterno{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

 
   Guardar(d : iGastoInterno) : Observable<string> 
   { 
        return this.http.post<any>(this._Cnx.Url() + "Proveedor/GastosInternos/Guardar", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });
   }
 

}