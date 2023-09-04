import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iEjercicioFiscal } from "src/app/Interface/Contabilidad/i-EjercicioFiscal";

@Injectable({
    providedIn: 'root',
  })
export class postEjercicioFiscal{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

 
   GuardarEjercio(d : iEjercicioFiscal) : Observable<string> { 
console.log(d.Periodos)
    return this.http.post<any>(this._Cnx.Url() + "Contabilidad/EjercicioFiscal/Guardar", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });

}

}