import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
  })
export class postTrasnferencia{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

 
   GuardarTransferencia(d : any) : Observable<string> { 
   
    return this.http.post<any>(this._Cnx.Url() + "Contabilidad/Transferencia/Guardar", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });

}

}