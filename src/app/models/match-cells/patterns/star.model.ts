import { MatchResult } from "../match_result/matchresult.interface";
import { MetaInformation } from "../metaInformationModel";
import { PatternStarVisitor } from "../visitors/patterns/patternStarVisitor.model";
import { Pattern } from './pattern.interface';

export class Star implements Pattern{

    /**
     * Constructor
     * @param _pattern patron asociada al simbolo star, es un char
     */
     constructor(
        public _pattern: Pattern
    ){
        this._pattern = _pattern;
    }

    /**
     * Funcion para evaluar un patron con un token
     * @param token token a comparar (char)
     * @param environment meta información del entorno
     * @returns retorna el match result resultante al evaluar el token con el pattern de la clausura
     */
    evaluation(token: string, environment: MetaInformation): MatchResult {
        // Evaluamos primeramente el patron asociado a la clausura
        const result: MatchResult = this._pattern.evaluation(token, environment);
        // DOUBLE DISPATCH - VISITOR
        // Instanciamos un pattern result visitor concreto para evaluar el resultado de la evaluación del token 
        const patternVisitor: PatternStarVisitor = new PatternStarVisitor();   
        // Evaluamos dicho visitor con el match result del pattern del token resultante
        // con el fin de obtener y generar la clase matchresult correspondiente al estado de coincidencia
        // del token (advance con star si hay match o skip en caso contrario)
        return result.evaluation(patternVisitor, this._pattern, environment, token);
    }

    /**
     * Funcion toString
     * @returns retorna un string con la información de la clase
     */
     public toString = () : string => {
        return `(${this._pattern})*`;
    }

}