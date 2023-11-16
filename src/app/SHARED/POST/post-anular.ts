import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "../class/Cadena_Conexion";


@Injectable({
    providedIn: 'root',
  })
export class postAnular{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }


    Anular(IdDoc : string, Motivo: string, Tipo : string, Usuario: string) : Observable<string> { 
        return this.http.post<any>(this._Cnx.Url() + "Documento/Anular?IdDoc=" + IdDoc + "&Motivo=" + Motivo + "&Tipo=" + Tipo + "&Usuario=" + Usuario, { headers: { 'content-type': 'application/text' } });

    }
 

}