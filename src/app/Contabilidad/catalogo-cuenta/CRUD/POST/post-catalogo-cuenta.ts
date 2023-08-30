import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iCuenta } from "src/app/Interface/i-Cuenta";

@Injectable({
    providedIn: 'root',
  })
export class postCuentaContable{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

 
   GuardarCatalogo(d : iCuenta) : Observable<string> { 
    console.log(d)
    return this.http.post<any>(this._Cnx.Url() + "Contabilidad/CatalogoCuenta/Guardar", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });

}

}