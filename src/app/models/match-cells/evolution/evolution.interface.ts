/******************************
 * IMPORTS
 ******************************/
 import { Cell } from "../cell.model";

 /**
  * Regla de evolución del listado de celulas de la solución
  */
export interface Evolution{

    /**
     * Funcion para evolucionar un listado de celulas en base a un token concreto
     * @param cells listado de celulas a evaluar
     * @param token token a comparar
     * @param idx indice asociado al token
     */
    evolve(cells: Cell[], token: string, idx: number): Cell[];
}