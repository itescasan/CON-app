export interface iRetencion{
    IdDetRetencion : any;
    IdTransferencia : any;
    Index : number;
    IdRetencion: number;
    Retencion : string;
    Porcentaje : number;
    Documento: string;
    Serie : string;
    TipoDocumento: string;
    IdMoneda: string;
    TasaCambio:number;
    SubTotal : number;
    SubTotalMS : number;
    SubTotalML : number;
    Monto : string;
    MontoMS: number;
    MontoML : number;
    PorcImpuesto : number;
    TieneImpuesto : boolean;
    CuentaContable : string;
    RetManual : boolean;
    Naturaleza : string;
}