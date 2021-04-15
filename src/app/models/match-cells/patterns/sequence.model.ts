/******************************
 * IMPORTS
 ******************************/
import { MatchResult } from '../match_result/matchresult.interface';
import { Pattern } from './pattern.interface';
import { MetaInformation } from '../metaInformationModel';
import { PatternSequenceVisitor } from '../visitors/patterns/patternSequenceVisitor.model';

export class Sequence implements Pattern{

    /**
     * Constructor
     * @param left patron izquierdo 
     * @param right patron derecho
     */
    constructor(
        public left: Pattern,
        public right: Pattern
    ){
        this.left = left;
        this.right = right;
    }

    /**
     * Funcion para evaluar un patron con un token
     * @param token token a comparar (char)
     * @param environment meta información del entorno
     * @returns retorna el match result resultante al evaluar el token con el pattern izquierdo
     */
    evaluation(token: string, environment: MetaInformation): MatchResult{
        // Evaluamos primeramente el patron izquierdo
        const result: MatchResult = this.left.evaluation(token, environment);
        // DOUBLE DISPATCH - VISITOR
        // Instanciamos un pattern result visitor concreto para evaluar el resultado de la evaluación del token 
        const patternVisitor: PatternSequenceVisitor = new PatternSequenceVisitor();
        // Evaluamos dicho visitor con el match result del pattern del token resultante
        // con el fin de obtener y generar la clase matchresult correspondiente al estado de coincidencia
        // del token (advance, match, stuck, etc)
        return result.evaluation(patternVisitor, this.right, environment, token);
    }
    
    /**
     * Funcion toString
     * @returns retorna un string con la información de la clase
     */
    public toString = () : string => {
        return ` [ ${this.left} -> ${this.right} ] `;
    }
}