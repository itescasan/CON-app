import { iIngCajaDetalle } from "./i-IngresoCaja-Detalle";

export interface iIngCaja {
    IdIngresoCajaChica: number;
    FechaRegistro: Date,   
    Cuenta: string;
    Consecutivo : number;    
    Usuario : string;
    UsuarioModifica : string;
    Aplicado : Boolean;
    Contabilizado : Boolean;    
}
