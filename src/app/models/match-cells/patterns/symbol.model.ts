/******************************
 * IMPORTS
 ******************************/
import { Pattern } from './pattern.interface';
import { Match } from '../match_result/match.model';
import { Stuck } from '../match_result/stuck.model';
import { MatchResult } from '../match_result/matchresult.interface';
import { MetaInformation } from '../metaInformationModel';

export class Symbol implements Pattern{

    /**
     * Constructor
     * @param _pattern patron asociada al simbolo, es un char
     */
    constructor(
        public _pattern: string
    ){
        this._pattern = _pattern;
    }

    /**
     * Funcion para evaluar un patron con un token
     * @param token token a comparar (char)
     * @param environment meta información del entorno
     * @returns si existe coincidencia retorna una clase de tipo match, en caso contrario un stuck
     */
    evaluation(token: string, environment: MetaInformation): MatchResult{
        return token === this._pattern ? new Match() : new Stuck();
    }

    /**
     * Funcion toString
     * @returns retorna un string con la información de la clase
     */
    public toString = () : string => {
        return `${this._pattern}`;
    }
    
}