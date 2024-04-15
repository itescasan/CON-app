import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
  })
export class getAsientoContable{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

 
   public Datos() : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AsientoContable/Datos");
   }

   public Get(Fecha1 : Date, Fecha2 : Date) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AsientoContable/Get?Fecha1=" + Fecha1 + "&Fecha2=" + Fecha2);
 }
   
 public GetDetalle(IdAsiento : number) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AsientoContable/GetDetalle?IdAsiento=" + IdAsiento);
 }

}