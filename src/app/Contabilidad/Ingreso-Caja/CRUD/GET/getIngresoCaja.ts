import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
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
      return this.http.get<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Datos?User=" + Usuario);
   }

   public Rubro(CuentaPadre : string) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Rubro?CuentaPadre=" + CuentaPadre);
 }

   public Get(Consecutivo : number ,Usuario :string, CuentaBodega : string ) : Observable<string>{
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Get?Consecutivo=" + Consecutivo  + "&USuario=" + Usuario + "&CuentaBodega=" + CuentaBodega);
 }
    public GetRptIngCaja(Id: number): Observable<string> {
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/IngresosCaja?Id=" + Id);
  }
 
  public GetRegistro(Usuario: string): Observable<string> {
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Registro?User=" + Usuario);
  }

  public GetRegistro2(): Observable<string> {
    return this.http.get<any>(this._Cnx.Url() + "Contabilidad/IngresoCajaChica/Registro2");
  }

}