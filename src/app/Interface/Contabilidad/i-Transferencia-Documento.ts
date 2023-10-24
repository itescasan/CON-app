export interface iTransferenciaDocumento{
    IdDetTrasnfDoc: any;
    Index : number;
    Operacion: string;
    Documento: string;
    Serie : string;
    TipoDocumento: string;
    Fecha: Date,
    IdMoneda: string,
    Saldo: string;
    SaldoDolar: number;
    SaldoCordoba: number;
    Importe : string;
    NuevoSaldo : string;
}