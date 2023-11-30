import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";


@Injectable({
    providedIn: 'root',
  })
export class getCheques{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

 
   public Datos() : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/Datos");
   }

    public Get(Fecha1: Date, Fecha2: Date, CodBodega: string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/Get?Fecha1=" + Fecha1 + "&Fecha2=" + Fecha2 + "&CodBodega=" + CodBodega);
    }

    public GetDocumentos(CodProveedor : string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/GetDocumentos?CodProveedor=" + CodProveedor);
    }

    public GetDetalleCuenta(IdCheque: string) {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/GetDetalleCuenta?IdCheque=" + IdCheque);
    }


    public GetDetalleDocumentos(IdCheque: string) {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/GetDetalleDocumentos?IdCheque=" + IdCheque); 
    }
    
    public GetRptCheque(NoAsiento: string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/Cheque?NoAsiento=" + NoAsiento);
    }


}