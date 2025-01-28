import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { timeout } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { iTransferenciaPOST } from "src/app/Interface/Contabilidad/I-transferencia-POST";
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

 
   GuardarTransferencia(d : iTransferenciaPOST) : Observable<string> { 
   
    return this.http.post<any>(this._Cnx.Url() + "Contabilidad/Transferencia/Guardar", JSON.stringify(d), { headers: { 'content-type': 'application/json' } }).pipe(timeout(this._Cnx.Timeout));

}

}