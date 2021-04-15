/******************************
 * IMPORTS
 ******************************/
 import { Cell } from '../cell.model';
import { MetaInformation } from '../metaInformationModel';
import { Evolution } from './evolution.interface';
export class MultipleMatch implements Evolution{
    
    /**
     * Funcion para evolucionar un listado de celulas en base a un token concreto
     * @param cells listado de celulas a evaluar
     * @param token token a comparar
     * @param idx indice asociado al token
     * @returns listado de celulas al evaluar cada una de las celulas del listado original
     */
    evolve(cells: Cell[], token: string, idx: number = 0): Cell[]{
        // Destructoramos el listado de celulas iniciales (enviada como parametro)
        // para generar un nuevo listado de celulas
        let cellsEvolution: Cell[] = [...cells];
        // Iteramos por cada elemento del nuevo listado de celulas
        for(let j=0; j < cellsEvolution.length; j++){
            // Realizamos la evaluación de la reacción de la celula correspondiente en base al token e indice a evaluar
            let cellIteration: Cell = cellsEvolution[j].react(token,idx)[0];
            // Verificamos que la celula no sea undefined (es decir que no es un match)
            // y comprobamos que la celula resultante no sea la misma celula evaluada (es decir que no se haya retornado a si mismo)
            if(cellIteration !== undefined && cellIteration != cellsEvolution[j]){
                // generamos una meta informacion para tener control de la celula padre y el indice del token
                cellIteration.metaInformation = new MetaInformation(idx, cells[j]);
                // agregamos la celula resultante al listado original de celulas
                cells.push(cellIteration);
            }
        }
        // retornamos el listado de celulas originales con sus respectivas reacciones del token evaluado
        return cells;
    }
}