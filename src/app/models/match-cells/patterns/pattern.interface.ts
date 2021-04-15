/******************************
 * IMPORTS
 ******************************/
import { MatchResult } from '../match_result/matchresult.interface';
import { MetaInformation } from '../metaInformationModel';

export interface Pattern{

    /**
     * Funcion para evaluar un patron con un token
     * @param token token a comparar (char)
     * @param environment meta información del entorno
     */
    evaluation(token: string, environment: MetaInformation): MatchResult;
}