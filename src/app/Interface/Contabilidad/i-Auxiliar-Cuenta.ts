export interface iAuxiliarCuenta{
    IdAsiento : number,
    Modulo : string,
    Fecha : Date,
    Serie : string,
    NoDoc : string,
    Cuenta : string,
    Concepto : string,
    Referencia : string,
    DEBE_ML : number,
    HABER_ML : number,
    Saldo_ML : number,
    DEBE_MS : number,
    HABER_MS : number,
    Saldo_MS : number,
    Cuenta_Padre: string
    Editar : number,
    Linea : number,
}