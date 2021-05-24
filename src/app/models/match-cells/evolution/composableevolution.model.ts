/******************************
 * IMPORTS
 ******************************/
import { Cell } from '../cell.model';
import { Evolution } from './evolution.interface';
 
 /**
  * 
  */
 export class ComposableEvolution implements Evolution {
 
     /**
      * Constructor
      * Se inicializa el listado de hijos como vacio
      */
     constructor(
         protected children: Evolution[] = []
     ){
         this.children = children;
     }
     
    /**
     * Metodo para agregar una nueva regla al listado de reglas de la clase
     * @param rule nueva regla a agregar
     */
    add(rule: Evolution):void {
        this.children.push(rule);
    }
 
     /**
      * Función para aplicar el listado de reglas hijas a un listado de celulas y generar la evolución de las celulas
      * @param cells listado de celulas a evaluar
      * @param token token a comparar
      * @param idx indice asociado al token
      * @returns retorna el listado de celulas resultantes, una vez aplicadas el listado de reglas hijas asociadas
    */
    evolve(cells: Cell[], token: string, idx: number = 0): Cell[]{
        let cellList: Cell[] = cells;
         // ITERAMOS POR CADA REGLA HIJAS
         this.children.forEach(child => {
             cellList = child.evolve(cellList,token, idx);
         });
         return cellList;
    }
 }