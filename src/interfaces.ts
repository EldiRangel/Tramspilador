export interface Metodo {
    nombre: string;
    parametros: string;
    retorno: string;
    acceso: string;
}

export interface ClaseTS {
    nombreClase: string;
    metodos: Metodo[];
}

export interface Proyecto {
    directorio: string;
    nombreModulo: string;
    entidades: ClaseTS[];
}