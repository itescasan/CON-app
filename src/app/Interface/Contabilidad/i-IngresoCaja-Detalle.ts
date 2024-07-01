export interface iIngCajaDetalle {
    IdDetalleIngresoCajaChica: number;
    IdIngresoCajaC : number;    
    FechaFactura: Date;
    Concepto: string;
    Referencia : string;
    Proveedor : string;
    Cuenta : string;
    CentroCosto : string;
    SubTotal : number;
    Iva : number;
    Total : number;
    CuentaEmpleado: any; 
}


