import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { timeout } from "rxjs";
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
      return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AsientoContable/Datos").pipe(timeout(this._Cnx.Timeout));
   }

   public Get(Fecha1 : string, Fecha2 : string) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AsientoContable/Get?Fecha1=" + Fecha1 + "&Fecha2=" + Fecha2).pipe(timeout(this._Cnx.Timeout));
 }
   
 public GetDetalle(IdAsiento : number) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AsientoContable/GetDetalle?IdAsiento=" + IdAsiento).pipe(timeout(this._Cnx.Timeout));
 }


   
 public GetReporte(IdAsiento : number, NoDocumento : string, IdMoneda : string, Exportar : boolean, Consolidado : boolean, Unificado : boolean, Modulo: boolean) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AsientoContable/GetReporte?IdAsiento=" + IdAsiento + "&NoDoc="+ NoDocumento + "&IdMoneda=" + IdMoneda + "&Exportar=" + Exportar + "&Consolidado=" + Consolidado + "&Unificado=" + Unificado + "&Modulo=" + Modulo).pipe(timeout(this._Cnx.Timeout));
 }


}