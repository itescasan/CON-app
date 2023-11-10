export interface iCheque {
    IdCheque: any;
    IdCuentaBanco: number;
    CuentaContable: string;
    CentroCosto: string;
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
}