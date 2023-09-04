import { iPeriodo } from "./i-Periodo";

export interface iEjercicioFiscal{
    IdEjercicio : number;    
    Nombre: string;
    FechaInicio: Date;
    FechaFinal: Date;
    ClasePeriodos: string,
    NumerosPeriodos: number;
    Estado: string;
    CuentaContableAcumulada : string;
    CuentaPerdidaGanancia : string;
    CuentaContablePeriodo : string;
    FechaReg : Date;
    UsuarioReg : string;

    Periodos : iPeriodo [];
    
}