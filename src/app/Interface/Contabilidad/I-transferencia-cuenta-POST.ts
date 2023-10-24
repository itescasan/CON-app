import { iAsiento } from "./i-Asiento";
import { iTransferenciaCuenta } from "./i-Transferencia-cuenta";

export interface iTransferenciaCuentaPOST{
    T: iTransferenciaCuenta;
    A: iAsiento;
}