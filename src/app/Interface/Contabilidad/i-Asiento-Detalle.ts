export interface iAsientoDetalle{
    IdDetalleAsiento: number;
    IdAsiento: number;
    NoLinea: number;
    CuentaContable: String;
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
    CentroCosto: string;
}