/******************************
 * IMPORTS
 ******************************/
import { Cell } from './cell.model';
export class MetaInformation{

    /**
     * Constructor
     * @param index indice del token a evaluar
     * @param parent celula padre
     */
    constructor(
        public index: number,
        public parent: Cell = null
    ){
        this.index = index;
        this.parent = parent;
    }
}