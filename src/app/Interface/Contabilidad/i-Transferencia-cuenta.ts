export interface iTransferenciaCunta{
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
    Anulado : boolean;
    UsuarioReg : string;
}