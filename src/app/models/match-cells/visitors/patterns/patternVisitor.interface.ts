/******************************
 * IMPORTS
 ******************************/
import { Advance } from "../../match_result/advance.model";
import { Match } from "../../match_result/match.model";
import { MatchResult } from "../../match_result/matchresult.interface";
import { Stuck } from "../../match_result/stuck.model";
import { Pattern } from "../../patterns/pattern.interface";
import { Skip } from '../../match_result/skip.model';
import { MetaInformation } from '../../metaInformationModel';

/**
 * Patron visitor - double dispatch para el reconocimiento de clases especificas dentro de la jerarquia de matchresult
 * y ejecutar codigo especifico para cada uno de ellos.
 * Con el objetivo de evitar el uso de instance of dentro de las condicionales del patron sequence o clausura.
 */
export interface PatternVisitor{
    /**
     * Función de evaluación para la clase Match
     * @param element objeto match a evaluar
     * @param rightPattern patron derecho restante de la celula
     */
    visitEvaluationPatternMatch(element: Match, rightPattern: Pattern): MatchResult;
    
    /**
     * Función de evaluación para la clase Stuck
     * @param element objeto stuck a evaluar
     */
    visitEvaluationPatternStuck(element: Stuck): MatchResult;
    
    /**
     * Función de evaluación para la clase Advance
     * @param element objeto advance a evaluar
     * @param rightPattern patron derecho restante de la celula
     */
    visitEvaluationPatternAdvance(element: Advance, rightPattern: Pattern): MatchResult;

    /**
     * Función de evaluación para la clase Skip
     * @param element objeto skip a evaluar
     * @param rightPattern patron derecho restante de la celula
     * @param environment meta información del entorno
     * @param token token a evaluar (char)
     */
    visitEvaluationPatternSkip(element: Skip, rightPattern: Pattern, environment: MetaInformation, token: string): MatchResult;

}