import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
})
export class getTransferencia {

    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor() {

        this.http = new HttpClient(new HttpXhrBackend({
            build: () => new XMLHttpRequest()
        }));

    }


    public Datos(): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Transferencia/Datos");
    }

    public GetDocumentos(CodProveedor : string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Transferencia/GetDocumentos?CodProveedor=" + CodProveedor);
    }


    public Get(Fecha1: string, Fecha2: string, CodBodega: string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Transferencia/Get?Fecha1=" + Fecha1 + "&Fecha2=" + Fecha2 + "&CodBodega=" + CodBodega);
    }


    public GetDetalleCuenta(IdTransferencia: string) {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Transferencia/GetDetalleCuenta?IdTransferencia=" + IdTransferencia);
    }

    public GetDetalleDocumentos(IdTransferencia: string) {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Transferencia/GetDetalleDocumentos?IdTransferencia=" + IdTransferencia);
    }


    public BuscarTiposRetenciones(NoDocumento: string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Transferencia/BuscarTiposRetenciones?NoDocumento=" + NoDocumento);
    }

    public GetReembolsoD(id : any): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Cheques/GetDetalleReembolso?id=" + id);
    }


    
    public GetReporteAsiento(IdTransferencia : string, Moneda : string, Exportar : boolean): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Transferencia/GetReporteAsiento?IdTransferencia=" + IdTransferencia + "&Moneda=" + Moneda + "&Exportar=" + Exportar);
    }

}