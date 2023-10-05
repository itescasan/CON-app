export interface iTransferenciaCuneta{
    IdTransferencia: any;
    IdCuentaBanco: number;
    CodBodega: string;
    NoTransferencia: string;
    Fecha: Date,
    Beneficiario: string;
    TasaCambio: number;
    Concepto : string;
    TipoTransferencia : string;
    Anulado : boolean;
    UsuarioReg : string;
}