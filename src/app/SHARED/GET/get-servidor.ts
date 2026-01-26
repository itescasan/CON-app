import { HttpClient, HttpHeaders, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "../class/Cadena_Conexion";
import { timeout } from "rxjs";
import { IdAcceso } from "../interface/i-Acceso";


@Injectable({
    providedIn: 'root',
  })
export class getServidor{
    
    private _Cnx = new Conexion();
    private http: HttpClient;
    private config: { version: string };

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    public DatosServidor(user : string) : Observable<any>{
      return this.http.get<any>(this._Cnx.Url() + "Sistema/DatosServidor?user="+ user + "&Modulo=CON").pipe(timeout(this._Cnx.Timeout));
   }
    
   public Login(user: string, pass : string) : Observable<any>{

     let u : IdAcceso = {} as IdAcceso;
      u.user = user;
      u.pass = pass;
      u.Modulo = "CON";



    return this.http.post<any>(this._Cnx.Url() + "Sistema/Login", JSON.stringify(u), { headers: { 'content-type': 'application/json' } }).pipe(timeout(this._Cnx.Timeout));
 }

 public ValidarCodigo(user: string, cod : string) : Observable<any>{
  return this.http.get<any>(this._Cnx.Url() + "Sistema/ValidarCodigo?user=" + user + "&cod=" + cod + "&Modulo=CON" ).pipe(timeout(this._Cnx.Timeout));
}

 public TC(f : Date) : Observable<any>{
  return this.http.get<any>(this._Cnx.Url() + "Sistema/TC?f="+ f).pipe(timeout(this._Cnx.Timeout));
}
  


public Serie(CodBodega : string, Tipo : string, Serie : string) : Observable<any>{
  return this.http.get<any>(this._Cnx.Url() + "Sistema/Serie?CodBodega="+ CodBodega + "&Tipo=" + Tipo + "&Serie=" + Serie).pipe(timeout(this._Cnx.Timeout));
}
  


public Consecutivo(Serie : string, Tipo : string) : Observable<any>{
  return this.http.get<any>(this._Cnx.Url() + "Sistema/Consecutivo?Serie="+ Serie + "&Tipo=" + Tipo).pipe(timeout(this._Cnx.Timeout));
}
  


public ConsecutivoContabilidad(Serie : string, Fecha : string) : Observable<any>{
  return this.http.get<any>(this._Cnx.Url() + "Sistema/ConsecutivoContabilidad?Serie="+ Serie + "&Fecha=" + Fecha).pipe(timeout(this._Cnx.Timeout));
}
  
 public AccesoWeb(user : string) : Observable<any>{
  return this.http.get<any>(this._Cnx.Url() + "Sistema/AccesoWeb?user=" + user).pipe(timeout(this._Cnx.Timeout));
}



public  Version()
{


  this.config = require("src/assets/config.json");

  const headers = new HttpHeaders()
    .set('Cache-Control', 'no-cache')
    .set('Pragma', 'no-cache');


  this.http
    .get<{ version: string }>("./assets/config.json", { headers })
    .subscribe(config => {

      if (config.version !== this.config.version) {

        location.reload();
      }
    });

}


}