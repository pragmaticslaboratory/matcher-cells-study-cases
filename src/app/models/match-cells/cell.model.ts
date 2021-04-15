/******************************
 * IMPORTS
 ******************************/
import { Pattern } from './patterns/pattern.interface';
import { MatchResult } from './match_result/matchresult.interface';
import { MetaInformation } from './metaInformationModel';
import { CellReactVisitor } from './visitors/cells/cellReactVisitor.model';

export class Cell{

    /**
     * Constructor
     * @param pattern patron asociado a la celula
     * @param metaInformation información del entorno de solución
     */
    constructor(
        public pattern: Pattern,
        public metaInformation: MetaInformation
    ){
        this.pattern = pattern;
        this.metaInformation = metaInformation;
    }

    /**
     * Función que retorna la meta información asociada a la celula
     * @returns metainformación asociada
     */
    passEnviroment(): MetaInformation{
        return this.metaInformation;
    }

    /**
     * Función que evaluar un token con el patron asociado a la celula. Permitiendo realizar su reacción y retornar
     * el listado de celulas resultantes
     * @param token token a evaluar (char)
     * @param index indice asociado al token
     * @returns listado de celulas resultantes luego de reaccionar al token evaluado
     */
    react(token: string, index: number = 0): Cell[]{
        // Evaluación del patron con respecto al token
        const result: MatchResult = this.pattern.evaluation(token, this.metaInformation);
        // DOUBLE DISPATCH - VISITOR
        // Instanciamos un cell reaction visitor concreto para evaluar el resultado de la evaluación del patron 
        const cellReactionVisitor: CellReactVisitor = new CellReactVisitor();
        // Evaluamos la reaction de dicho visitor con el match result del pattern
        // con el fin de obtener y generar el listado de celulas en base al tipo de clase (advance, match, stuck, etc)
        return result.reaction(cellReactionVisitor,this,token,index);
    }
}