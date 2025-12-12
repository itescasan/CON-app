import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { timeout } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
  })
export class getIngresoCaja{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

 
   public Datos(Usuario : string) : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Datos?User=" + Usuario).pipe(timeout(this._Cnx.Timeout));
   }

   public Rubro(CuentaPadre : string,Usuario : string) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Rubro?CuentaPadre=" + CuentaPadre + '&Usuario=' + Usuario).pipe(timeout(this._Cnx.Timeout));
 }

   public Get(Consecutivo : number ,Usuario :string, CuentaBodega : string ) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Get?Consecutivo=" + Consecutivo  + "&USuario=" + Usuario + "&CuentaBodega=" + CuentaBodega).pipe(timeout(this._Cnx.Timeout));
 }
    public GetRptIngCaja(Id: number,Usuario : string): Observable<string> {
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/IngresosCaja?Id=" + Id  + "&Usuario=" + Usuario).pipe(timeout(this._Cnx.Timeout));
  }
 
  public GetRegistro(Usuario: string): Observable<string> {
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Registro?User=" + Usuario).pipe(timeout(this._Cnx.Timeout));
  }

  public GetRegistro2(): Observable<string> {
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Registro2").pipe(timeout(this._Cnx.Timeout));
  }

  public Validar(Consecutivo : number,CuentaPadre : string) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/ValidarCaja?Consecutivo=" + Consecutivo  + "&CuentaPadre=" +  CuentaPadre).pipe(timeout(this._Cnx.Timeout));
 }


}