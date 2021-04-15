/******************************
 * IMPORTS
 ******************************/
import { Cell } from '../cell.model';
import { ComposableRule } from './composablerule.model';
import { Pattern } from '../patterns/pattern.interface';

export class AddSeed extends ComposableRule{

    /**
     * Función para aplicar una regla a un listado de celulas y generar la post evolución de la solución
     * @param cells listado de celulas a evaluar
     * @param pattern patron inicial de la solución 
     * @returns si el listado de celulas es vacio, retorna un listado que contiene la celula original de la solución (add seed)
     * en caso contrario retorna el mismo listado de celulas 
     */
    apply(cells: Cell[], pattern: Pattern): Cell[]{
        return (cells.length === 0) ? [new Cell(pattern, null)] : cells;
    }
}