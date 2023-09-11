import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
  })
export class getEjercicioFiscal{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    
   public Get() : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/EjercicioFiscal/Get");
 }
   
 public GetPeriodo(IdEjercicio : any) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/EjercicioFiscal/Periodo?IdEjercicio=" + IdEjercicio);
 }

}