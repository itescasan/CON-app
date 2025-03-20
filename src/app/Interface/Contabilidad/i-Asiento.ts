import { iAsientoDetalle } from "./i-Asiento-Detalle";

export interface iAsiento{
    IdAsiento: number;
    IdPeriodo: number;
    NoAsiento: string;
    IdSerie: string;
    Fecha: Date,
    IdMoneda: string;
    TasaCambio: number;
    Concepto : string;
    NoDocOrigen : string;
    IdSerieDocOrigen : string;
    TipoDocOrigen : string;
    Bodega: string;
    Referencia: string;
    Estado: string;
    TipoAsiento: string;
    Total: number;
    TotalML: number;
    TotalMS: number;
    FechaReg: Date;
    UsuarioReg: string;
    Automatico : boolean;
    Revisado : boolean;    

    AsientosContablesDetalle : iAsientoDetalle[]
}