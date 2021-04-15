/******************************
 * IMPORTS
 ******************************/
import { Cell } from '../../cell.model';
import { Match } from '../../match_result/match.model';
import { Stuck } from '../../match_result/stuck.model';
import { Advance } from '../../match_result/advance.model';
import { MetaInformation } from '../../metaInformationModel';
import { Skip } from '../../match_result/skip.model';

/**
 * Patron visitor - double dispatch para el reconocimiento de clases especificas dentro de la jerarquia de matchresult
 * y ejecutar codigo especifico para cada uno de ellos.
 * Con el objetivo de evitar el uso de instance of dentro de las condicionales de las celulas.
 */
export interface CellVisitor{
    
    /**
     * Funcion para evaluar la rección de la clase Match
     * @param element objeto match a evaluar
     * @param token token de evaluación de la celula (char)
     * @param index indice asociado al token
     */
    visitReactCellMatch(element: Match, token: string, index: number): Cell[];

    /**
     * Funcion para evaluar la rección de la clase Stuck
     * @param element objeto stuck a evaluar
     * @param cell celula actual que se encuentra en reacción
     */
    visitReactCellStuck(element: Stuck, cell: Cell): Cell[];

    /**
     * Funcion para evaluar la rección de la clase Advance
     * @param element objeto advance a evaluar
     * @param metaInformation Meta información asociada a la celula actual
     */
    visitReactCellAdvance(element: Advance, metaInformation: MetaInformation): Cell[];

    /**
     * Funcion para evaluar la rección de la clase Skip
     * @param element objeto skip a evaluar
     * @param token token de evaluación de la celula (char)
     * @param index indice asociado al token
     */
     visitReactCellSkip(element: Skip, token: string, index: number): Cell[];
}