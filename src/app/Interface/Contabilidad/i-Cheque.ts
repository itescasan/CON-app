import { iRetencion } from "./i-Retencion";
import { iChequeDocumento } from "./i-Cheque-Documento";

export interface iCheque {
    IdCheque: any;
    IdCuentaBanco: number;
    CuentaContable: string;
    CentroCosto: string;
    CodProveedor: string;
    IdMoneda: string;
    CodBodega: string;
    IdSerie: string;
    NoCheque: string;
    Fecha: Date,
    Beneficiario: string;   
    TasaCambio: number;
    Concepto : string;
    TipoCheque : string;
    Comision: number;
    ComisionCordoba: number;
    ComisionDolar: number;
    Total: number;
    TotalCordoba: number;
    TotalDolar: number; 
    Anulado : boolean;
    UsuarioReg : string;
    IdIngresoCaja: any;
    CuentaIngCaja: string;
    ChequeDocumento: iChequeDocumento[];
    ChequeRetencion: iRetencion[];
}