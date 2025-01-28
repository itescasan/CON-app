import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { timeout } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
  })
export class getCuentaContable{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

 
   public Datos() : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Contabilidad/CatalogoCuenta/Datos").pipe(timeout(this._Cnx.Timeout));
   }

   public GetCuentaNueva(Nivel : number, Grupo : number, CuentaPadre : string) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/CatalogoCuenta/GetCuentaNueva?Nivel=" + Nivel + "&Grupo=" + Grupo + "&CuentaPadre=" + CuentaPadre).pipe(timeout(this._Cnx.Timeout));
 }

   public Get() : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/CatalogoCuenta/Get").pipe(timeout(this._Cnx.Timeout));
 }
   

}