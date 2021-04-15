import { MatchResult } from "../match_result/matchresult.interface";
import { MetaInformation } from "../metaInformationModel";
import { Pattern } from "./pattern.interface";
import { Sequence } from './sequence.model';
import { Star } from './star.model';

export class Plus implements Pattern{

    /**
     * Constructor
     * @param _pattern patron asociada al simbolo star, es un char
     */
     constructor(
        public _pattern: Pattern
    ){
        this._pattern = new Sequence(_pattern, new Star(_pattern));
    }

    /**
     * Funcion para evaluar un patron con un token
     * @param token token a comparar (char)
     * @param environment meta información del entorno
     * @returns retorna el match result resultante al evaluar el token con el pattern de la clausura positiva
     */
    evaluation(token: string, environment: MetaInformation): MatchResult {
        return this._pattern.evaluation(token, environment);
    }

    /**
     * Funcion toString
     * @returns retorna un string con la información de la clase
     */
     public toString = () : string => {
        return `(${this._pattern})`;
    }
    
}