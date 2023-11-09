import { iAsiento } from "./i-Asiento";
import { iTransferencia } from "./i-Transferencia";

export interface iTransferenciaPOST{
    T: iTransferencia;
    A: iAsiento;
}