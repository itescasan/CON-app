import { iAsiento } from "./i-Asiento";
import { iTransferenciaCunta } from "./i-Transferencia-cuenta";

export interface iTransferenciaCuentaPOST{
    T: iTransferenciaCunta;
    A: iAsiento;
}