/******************************
 * IMPORTS
 ******************************/
import { Advance } from '../../match_result/advance.model';
import { Match } from '../../match_result/match.model';
import { MatchResult } from '../../match_result/matchresult.interface';
import { Stuck } from '../../match_result/stuck.model';
import { Pattern } from '../../patterns/pattern.interface';
import { Sequence } from '../../patterns/sequence.model';
import { PatternVisitor } from './patternVisitor.interface';
import { MetaInformation } from '../../metaInformationModel';
import { Skip } from '../../match_result/skip.model';

export class PatternSequenceVisitor implements PatternVisitor{

    /**
     * Función de evaluación para la clase Match
     * @param element objeto match a evaluar
     * @param rightPattern patron derecho restante de la celula
     * @returns un objeto de tipo Advance con el patron derecho restante para la generación de una nueva celula,
     * debido a que la evaluación actual es de tipo match (hubo coincidencia con el token)
     */
    visitEvaluationPatternMatch(element: Match, rightPattern: Pattern): MatchResult {
        return new Advance(rightPattern);
    }
    
    /**
     * Función de evaluación para la clase Stuck
     * @param element objeto stuck a evaluar
     * @returns un objeto stuck para indicar que al evaluar el token no hubo coincidencia
     */
    visitEvaluationPatternStuck(element: Stuck): MatchResult {
        return new Stuck();
    }

    /**
     * Función de evaluación para la clase Advance
     * @param element objeto advance a evaluar
     * @param rightPattern patron derecho restante de la celula
     * @returns un objeto de tipo Advance con el patron actual del elemento advance y el patron derecho restante de la celula
     */
    visitEvaluationPatternAdvance(element: Advance, rightPattern: Pattern): MatchResult {
        return new Advance(new Sequence(element.pattern, rightPattern));
    }

    /**
     * Función de evaluación para la clase Skip
     * @param element objeto skip a evaluar
     * @param rightPattern patron derecho restante de la celula
     * @param environment meta información del entorno
     * @param token token a evaluar (char)
     * @returns un objeto de tipo Skip con el patron actual del elemento skip y el patron derecho restante de la celula
     */
     visitEvaluationPatternSkip(element: Skip, rightPattern: Pattern, environment: MetaInformation, token: string): MatchResult {
        return rightPattern.evaluation(token, environment );
    }

}