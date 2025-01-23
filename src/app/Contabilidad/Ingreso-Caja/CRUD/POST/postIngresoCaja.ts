import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iIngresoCajaPost } from "src/app/Interface/Contabilidad/i-IngresoCaja-POST";

@Injectable({
    providedIn: 'root',
  })
export class postIngresoCaja{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

 
   GuardarIngresoCaja(d : iIngresoCajaPost) : Observable<string> 
   { 
        return this.http.post<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Guardar", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });
   }

    EliminarDetalleCaja(id : number) : Observable<string> 
    {        
        return this.http.post<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Eliminar?IdIngCajaDetalle=" + id, { headers: { 'content-type': 'application/text' } });        
    }

    EnviarIngCaja(id : number, user: string) : Observable<string> 
    {        
        return this.http.post<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Enviar?IdIngresoCaja=" + id + "&user=" + user, { headers: { 'content-type': 'application/text' } });        
    }

    CorreccionIngCaja(id : number, user: string) : Observable<string> 
    {        
        return this.http.post<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Corregir?IdIngresoCaja=" + id + "&user=" + user, { headers: { 'content-type': 'application/text' } });        
    }
    
    AplicarIngCaja(id : number, user: string) : Observable<string> 
    {        
        return this.http.post<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Aplicar?IdIngresoCaja=" + id + "&user=" + user, { headers: { 'content-type': 'application/text' } });        
    }

   

}