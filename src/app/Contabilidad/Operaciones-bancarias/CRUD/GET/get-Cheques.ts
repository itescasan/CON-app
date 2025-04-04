import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { timeout } from "rxjs";
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
      return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/Datos").pipe(timeout(this._Cnx.Timeout));
   }

    public Get(Fecha1: Date, Fecha2: Date, CodBodega: string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/Get?Fecha1=" + Fecha1 + "&Fecha2=" + Fecha2 + "&CodBodega=" + CodBodega).pipe(timeout(this._Cnx.Timeout));
    }

    public GetDocumentos(CodProveedor : string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/GetDocumentos?CodProveedor=" + CodProveedor).pipe(timeout(this._Cnx.Timeout));
    }

    public GetDetalleCuenta(IdCheque: string) {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/GetDetalleCuenta?IdCheque=" + IdCheque).pipe(timeout(this._Cnx.Timeout));
    }


    public GetDetalleDocumentos(IdCheque: string) {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/GetDetalleDocumentos?IdCheque=" + IdCheque).pipe(timeout(this._Cnx.Timeout)); 
    }
    
    public GetRptCheque(NoAsiento: string,IdMoneda : string, Exportar : boolean): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/Cheque?NoAsiento=" + NoAsiento + IdMoneda + "&Exportar=" + Exportar).pipe(timeout(this._Cnx.Timeout));
    }

    public GetRptCheques(NoAsiento: string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/Cheque?NoAsiento=" + NoAsiento ).pipe(timeout(this._Cnx.Timeout));
    }

    public GetReembolsoD(id : any): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/GetDetalleReembolso?id=" + id).pipe(timeout(this._Cnx.Timeout));
    }



}