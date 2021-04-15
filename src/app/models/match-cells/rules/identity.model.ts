/******************************
 * IMPORTS
 ******************************/
import { Rule } from './rule.interface';
import { Cell } from '../cell.model';
import { Pattern } from '../patterns/pattern.interface';

export class Identity implements Rule{
    
    /**
     * Función para aplicar una regla a un listado de celulas y generar la post evolución de la solución
     * @param cells listado de celulas a evaluar
     * @param pattern patron inicial de la solución
     * @returns retorna el mismo listado de celulas 
     */
    apply(cells: Cell[], pattern: Pattern): Cell[]{
        return cells;
    }
}