export interface iTransferenciaCuenta{
    IdTransferencia: any;
    IdCuentaBanco: number;
    CodBodega: string;
    IdSerie: string;
    NoTransferencia: string;
    Fecha: Date,
    Beneficiario: string;
    TasaCambio: number;
    Concepto : string;
    TipoTransferencia : string;
    Total: number;
    TotalCordoba: number;
    TotalDolar: number;
    Anulado : boolean;
    UsuarioReg : string;
}