import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iPerfil } from "../interface/i-Perfiles";
import { timeout } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
export class postServidor{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    GuardarAcceso(d : iPerfil[]) : Observable<string> { 
        return this.http.post<any>(this._Cnx.Url() + "Sistema/GuardarAcceso", JSON.stringify(d), { headers: { 'content-type': 'application/json' } }).pipe(timeout(this._Cnx.Timeout));
    }


    CerrarSession(user : string) : Observable<string> { 
        return this.http.post<any>(this._Cnx.Url() + "Sistema/CerrarSession?user=" + user, { headers: { 'content-type': 'application/text' } }).pipe(timeout(this._Cnx.Timeout));
    }


}