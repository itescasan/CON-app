export interface iAsientoDetalle{
    IdDetalleAsiento: number;
    IdAsiento: number;
    NoLinea: number;
    CuentaContable: any;
    Debito: string,
    DebitoML: number;
    DebitoMS: number;
    Credito : string;
    CreditoML : number;
    CreditoMS : number;
    Modulo : string;
    Descripcion: string;
    Referencia: string;
    Naturaleza: string;
    CentroCosto: any;
    NoDocumento : string;
    TipoDocumento : string;
    Editar : boolean;
}