/******************************
 * IMPORTS
 ******************************/
import { Cell } from '../cell.model';
import { Pattern } from '../patterns/pattern.interface';

/**
 * Reglas de post-evolución
 */
export interface Rule{
    /**
     * Función para aplicar una regla a un listado de celulas y generar la post evolución de la solución
     * @param cells listado de celulas a evaluar
     * @param pattern patron inicial de la solución
     */
    apply(cells: Cell[], pattern: Pattern): Cell[];
}