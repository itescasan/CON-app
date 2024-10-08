import { iRetencion } from "./i-Retencion";
import { iTransferenciaDocumento } from "./i-Transferencia-Documento";

export interface iTransferencia{
    IdTransferencia: any;
    IdCuentaBanco: number;
    IdMoneda: string;
    CodBodega: string;
    IdSerie: string;
    NoTransferencia: string;
    Fecha: Date,
    Beneficiario: string;
    CodProveedor: string;
    TasaCambio: number;
    Concepto : string;
    TipoTransferencia : string;
    Comision: number;
    ComisionCordoba: number;
    ComisionDolar: number;
    Total: number;
    TotalCordoba: number;
    TotalDolar: number;
    CentroCosto: string;
    IdIngresoCajaChica: any;
    CuentaCaja : string;
    Anulado : boolean;
    UsuarioReg : string;  
    TransferenciaDocumento: iTransferenciaDocumento[];
    TranferenciaRetencion: iRetencion[];    
}