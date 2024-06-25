import { iIngCaja } from "./i-IngresoCaja";
import { iIngCajaDetalle } from "./i-IngresoCaja-Detalle";

export interface iIngresoCajaPost{
    I: iIngCaja;
    D: iIngCajaDetalle;
}