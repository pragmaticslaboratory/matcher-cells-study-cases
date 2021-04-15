/******************************
 * IMPORTS
 ******************************/
import { Advance } from '../../match_result/advance.model';
import { Match } from "../../match_result/match.model";
import { MatchResult } from "../../match_result/matchresult.interface";
import { Skip } from '../../match_result/skip.model';
import { Stuck } from "../../match_result/stuck.model";
import { MetaInformation } from "../../metaInformationModel";
import { Pattern } from "../../patterns/pattern.interface";
import { PatternVisitor } from "./patternVisitor.interface";
import { Star } from '../../patterns/star.model';

export class PatternStarVisitor implements PatternVisitor{

    /**
     * Función de evaluación para la clase Match
     * @param element objeto match a evaluar
     * @param pattern patron asociado a la clausura de star
     * @returns un objeto de tipo Advance con el patron de la clausura star,
     * debido a que la evaluación actual es de tipo match (hubo coincidencia con el token)
     */
    visitEvaluationPatternMatch(element: Match, pattern: Pattern): MatchResult {
        return new Advance(new Star(pattern));
    }

    /**
     * Función de evaluación para la clase Stuck
     * @param element objeto stuck a evaluar
     * @returns un objeto de tipo Skip con el patron actual del elemento skip
     */
    visitEvaluationPatternStuck(element: Stuck): MatchResult {
        return new Skip();
    }

    /**
     * Función de evaluación para la clase Advance
     * @param element objeto advance a evaluar
     * @param rightPattern patron derecho restante de la celula
     * @returns un objeto de tipo Skip con el patron actual del elemento skip
     */
    visitEvaluationPatternAdvance(element: Advance, rightPattern: Pattern): MatchResult {
        return new Skip();
    }

    /**
     * Función de evaluación para la clase Skip
     * @param element objeto skip a evaluar
     * @param rightPattern patron derecho restante de la celula
     * @param environment meta información del entorno
     * @param token token a evaluar (char)
     * @returns un objeto de tipo Skip con el patron actual del elemento skip
     */
    visitEvaluationPatternSkip(element: Skip, rightPattern: Pattern, environment: MetaInformation, token: string): MatchResult {
        return new Skip();
    }
    
}