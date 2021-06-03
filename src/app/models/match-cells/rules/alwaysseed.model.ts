/******************************
 * IMPORTS
 ******************************/
 import { Cell } from '../cell.model';
 import { Pattern } from '../patterns/pattern.interface';
 import { Rule } from './rule.interface';
 
 export class AlwaysSeed implements Rule{
 
     /**
      * Función para aplicar una regla a un listado de celulas y generar la post evolución de la solución
      * @param cells listado de celulas a evaluar
      * @param pattern patron inicial de la solución 
      * @returns 
      */
     apply(cells: Cell[], pattern: Pattern): Cell[]{
         return cells.some(cell => cell.pattern === pattern)? cells: cells.concat([new Cell(pattern, null)]);
     }
 }