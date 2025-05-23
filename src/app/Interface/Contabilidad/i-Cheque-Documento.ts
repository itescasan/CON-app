export interface iChequeDocumento{
    IdDetChequeDoc: any;
    IdCheque : any;
    Index : number;
    Operacion: string;
    Documento: string;
    Serie : string;
    TipoDocumento: string;
    Fecha: Date,
    IdMoneda: string,
    TasaCambioDoc : number;
    SaldoAnt: number;
    SaldoAntML: number;
    SaldoAntMS: number;
    Saldo: string;
    SaldoDolar: number;
    SaldoCordoba: number;
    Importe : string;
    ImporteML : number;
    ImporteMS : number;
    NuevoSaldo : string;
    NuevoSaldoML : number;
    NuevoSaldoMS : number;
    DiferencialML : number;
    DiferencialMS : number;
    Retenido : boolean;
    Impuesto : number;
    PorcImpuesto : number;
    Seleccionar : boolean;
}