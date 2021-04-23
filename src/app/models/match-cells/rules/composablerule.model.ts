/******************************
 * IMPORTS
 ******************************/
import { Cell } from '../cell.model';
import { Rule } from './rule.interface';
import { Pattern } from '../patterns/pattern.interface';

/**
 * 
 */
export class ComposableRule implements Rule {

    /**
     * Constructor
     * Se inicializa el listado de hijos como vacio
     */
    constructor(
        protected children: Rule[] = []
    ){
        this.children = children;
    }
    
    /**
     * Metodo para agregar una nueva regla al listado de reglas de la clase
     * @param rule nueva regla a agregar
     */
    add(rule: Rule):void {
        this.children.push(rule);
    }

    /**
     * Función para aplicar el listado de reglas hijas a un listado de celulas y generar la post evolución de la solución
     * @param cells listado de celulas a evaluar
     * @param pattern patron inicial de la solución
     * @returns retorna el listado de celulas resultantes, una vez aplicadas el listado de reglas hijas asociadas
     */
    apply(cells: Cell[], pattern: Pattern): Cell[]{
        // CREAR COPIA DE LAS CELULAS ACTUALES
        let cellList: Cell[] = cells;
        // ITERAMOS POR CADA REGLA HIJAS
        this.children.forEach(child => {
            cellList = child.apply(cellList,pattern);
        });
        return cellList;
    }
}