export interface iAuxiliarCuenta{

    Fecha : Date,
    Serie : string,
    NoDoc : string,
    Cuenta : string,
    Concepto : string,
    Referencia : string,
    DEBE : number,
    HABER : number,
    Linea : number,
    Cuenta_Padre: string
}