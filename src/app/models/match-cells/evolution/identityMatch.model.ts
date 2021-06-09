/******************************
 * IMPORTS
 ******************************/
 import { Cell } from '../cell.model';
import { Evolution } from './evolution.interface';
/**
 * Solo un match a la vez
 */
export class IdentityMatch implements Evolution{
    
    /**
     * Funcion para evolucionar un listado de celulas en base a un token concreto
     * @param cells listado de celulas a evaluar
     * @param token token a comparar
     * @param idx indice asociado al token
     * @returns retorna un listado original
     */
    evolve(cells: Cell[], token: string, idx: number = 0): Cell[]{
        return cells;
    }
}