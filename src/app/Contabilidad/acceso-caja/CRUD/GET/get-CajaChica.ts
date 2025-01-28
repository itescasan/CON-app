import { HttpClient, HttpHeaders, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { timeout } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";


@Injectable({
    providedIn: 'root',
  })
export class getCajaChica{
    
    private _Cnx = new Conexion();
    private http: HttpClient;
    private config: { version: string };

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }
   
  public AccesoCajaChica(user : string) : Observable<any>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/AccesoCajaChica?user=" + user ).pipe(timeout(this._Cnx.Timeout));
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