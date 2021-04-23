/******************************
 * IMPORTS
 ******************************/
 import { Rule } from './rule.interface';
 import { Cell } from '../cell.model';
 import { Pattern } from '../patterns/pattern.interface';
 
 export class CustomRule implements Rule{
     
    /**
     * Constructor
     * @param nameRule nombre de la nueva regla
     * @param evaluateFunction funcion de evaluación a ejecutar
     */
    constructor(
        public nameRule: string = 'New Rule',
        public evaluateFunction: string = ''
    ){
        this.nameRule = nameRule;
        this.evaluateFunction = evaluateFunction;
    }

     /**
      * Función para aplicar una regla personalizada a un listado de celulas y generar la post evolución de la solución
      * @param cells listado de celulas a evaluar
      * @param pattern patron inicial de la solución
      * @returns retorna el mismo listado de celulas 
      */
     apply(cells: Cell[], pattern: Pattern): Cell[]{
         return eval.call(this, this.evaluateFunction);
     }
 }