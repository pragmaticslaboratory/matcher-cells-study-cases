/******************************
 * IMPORTS
 ******************************/
import { Cell } from '../cell.model';
import { Pattern } from '../patterns/pattern.interface';
import { Symbol } from '../patterns/symbol.model';
import { Rule } from './rule.interface';
 
export class AddSeedCustom implements Rule{
 
    /**
     * Constructor
     * @param nameRule nombre de la nueva regla
     * @param evaluateFunction funcion de evaluación a ejecutar
     */
     constructor(
        public token: string = 'a',
        public pattern: Pattern = null
    ){
        this.token = token;
        this.pattern = new Symbol(token);
    }

    /**
     * Metodo para establecer el nuevo patron asociado a la clase
     */
     setPattern(pattern: Pattern):void {
        this.pattern = pattern;
    }

     /**
      * Función para aplicar una regla a un listado de celulas y generar la post evolución de la solución
      * @param cells listado de celulas a evaluar
      * @param pattern patron inicial de la solución 
      * @returns si el listado de celulas es vacio, retorna un listado con una nueva celula que contiene el patron establecido 
      * como parametro de la clase, en caso contrario retorna el mismo listado de celulas 
      */
     apply(cells: Cell[], pattern: Pattern): Cell[]{
         return (cells.length === 0) ? [new Cell(this.pattern, null)] : cells;
     }
}