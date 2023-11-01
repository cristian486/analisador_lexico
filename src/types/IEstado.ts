export interface IEstado {
    indice: string;
    letra: string;
    inicial: boolean;
    final: boolean;
    proximo: IEstado | null;
    anterior: IEstado | null;
}