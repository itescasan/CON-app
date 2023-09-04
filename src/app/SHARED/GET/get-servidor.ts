import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "../class/Cadena_Conexion";


@Injectable({
    providedIn: 'root',
  })
export class getServidor{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    public FechaServidor(user : string) : Observable<any>{
      return this.http.get<any>(this._Cnx.Url() + "Sistema/FechaServidor?user="+ user);
   }
    
   public Login(user: string, pass : string) : Observable<any>{
    return this.http.get<any>(this._Cnx.Url() + "Sistema/Login?user=" + user + "&pass=" + pass);
 }

 public TC(f : Date) : Observable<any>{
  return this.http.get<any>(this._Cnx.Url() + "Sistema/TC?f="+ f);
}
  


public Serie(CodBodega : string, Tipo : string) : Observable<any>{
  return this.http.get<any>(this._Cnx.Url() + "Sistema/CodBodega?f="+ CodBodega + "&Tipo=" + Tipo);
}
  


public Consecutivo(Serie : string, Tipo : string) : Observable<any>{
  return this.http.get<any>(this._Cnx.Url() + "Sistema/Consecutivo?Serie="+ Serie + "&Tipo=" + Tipo);
}
  
 

}