export interface iCuenta{
    CuentaContable: string;
    NombreCuenta: string;
    Nivel: number;
    IdGrupo: number;
    Grupo: string,
    ClaseCuenta: string;
    CuentaPadre: string;
    Naturaleza : string;
    Bloqueada : boolean;
    Filtro : string;
    UsuarioModifica : string;
}