/******************************
 * IMPORTS
 ******************************/
 import { Cell } from '../cell.model';
import { Evolution } from './evolution.interface';
/**
 * Solo un match a la vez
 */
export class OnlyOneMatch implements Evolution{
    
    /**
     * Funcion para evolucionar un listado de celulas en base a un token concreto
     * @param cells listado de celulas a evaluar
     * @param token token a comparar
     * @param idx indice asociado al token
     * @returns retorna un listado de celulas solo al evaluar el primer elemento del listado
     * permitiendo de esta forma solo realizar un match a la vez
     */
    evolve(cells: Cell[], token: string, idx: number = 0): Cell[]{
        return cells[0].react(token, idx);
    }
}