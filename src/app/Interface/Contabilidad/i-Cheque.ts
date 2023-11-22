import { SimpleRNG } from "pdf-lib/cjs/utils/rng";
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
    Total: number;
    TotalCordoba: number;
    TotalDolar: number; 
    Anulado : boolean;
    UsuarioReg : string;
    ChequeDocumento: iChequeDocumento[];
}