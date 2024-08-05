import { DecimalPipe } from "@angular/common";
import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ConfCajaChicaComponent } from "src/app/Contabilidad/techo-caja-chica/conf-caja-chica.component";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";


@Injectable({
    providedIn: 'root',
  })
export class getReporteContable{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }


    public GetBalanzaComprobacion(Fecha1: String, Fecha2: String, Nivel: number, EsMonedaLocal : boolean): Observable<string> {
  
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/BalanzaComprobacion?FechaInicio=" + Fecha1 + "&FechaFinal=" + Fecha2 + "&Nivel=" + Nivel + "&EsMonedaLocal=" + EsMonedaLocal);
    }


    public GetBalanceGeneral(Fecha: String,  EsMonedaLocal : boolean): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/BalanceGeneral?Fecha=" + Fecha + "&EsMonedaLocal=" + EsMonedaLocal);
    }

    public GetEstadoResultado(Fecha: String, Estado: boolean, EsMonedaLocal : boolean, Sucursal: string, CCosto: string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/EstadoResultado?Fecha=" + Fecha + "&Estado=" + Estado  + "&EsMonedaLocal=" + EsMonedaLocal + "&Sucursal=" + Sucursal + "&CCosto=" + CCosto);
    }

    public GetGastosxCC(Fecha: String,  EsMonedaLocal : boolean, CCosto: string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/GastoCC?Fecha=" + Fecha +  "&EsMonedaLocal=" + EsMonedaLocal + "&CCosto=" + CCosto);
    }

    public GetLibroDiario(Fecha: String, Estado: boolean, EsMonedaLocal : boolean): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/LibroDiario?Fecha=" + Fecha + "&Estado=" + Estado  +  "&EsMonedaLocal=" + EsMonedaLocal);
    }

    public GetLibroMayor(Fecha: String, Estado: boolean, EsMonedaLocal : boolean): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/LibroMayor?Fecha=" + Fecha + "&Estado=" + Estado  +  "&EsMonedaLocal=" + EsMonedaLocal);
    }

    public GetVentasAlcaldia(Fecha: String, Sucurasal: string, Municipio : string): Observable<string> {
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/VentasAlcaldia?Fecha=" + Fecha + "&Sucursal=" + Sucurasal  +  "&Municipio=" + Municipio );
    }

    public Datos() : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Contabilidad/Reporte/Datos");
     }
        

}