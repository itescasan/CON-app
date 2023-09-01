export interface iAsientoDetalle{
    IdDetalleAsiento: number;
    IdAsiento: number;
    NoLinea: number;
    CuentaContable: string;
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
}