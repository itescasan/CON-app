import { HttpClient, HttpHeaders, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";


@Injectable({
    providedIn: 'root',
  })
export class getAriculo{
    
    private _Cnx = new Conexion();
    private http: HttpClient;
    private config: { version: string };

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }
   
  public Get() : Observable<any>{
    return this.http.get<any>(this._Cnx.Url() + "Proveedor/Articulo/Get");
  }  

}