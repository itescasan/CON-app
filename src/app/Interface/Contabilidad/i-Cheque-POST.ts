import { iAsiento } from "./i-Asiento";
import { iCheque } from "./i-Cheque";

export interface iChequePOST{
    C: iCheque;
    A: iAsiento;
}