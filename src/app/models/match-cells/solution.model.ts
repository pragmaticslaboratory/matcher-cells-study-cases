/******************************
 * IMPORTS
 ******************************/
import { Cell } from './cell.model';
import { Rule } from './rules/rule.interface';
import { Identity } from './rules/identity.model';
import { Pattern } from './patterns/pattern.interface';
import { OnlyOneMatch } from './evolution/onlyOneMatch.model';
import { Evolution } from './evolution/evolution.interface';

export class Solution{
    
    /**
     * Constructor
     * @param cells listado de celulas iniciales de la solución, contienen el patron a evaluar 
     * @param evolution la regla de evolución de las celulas de la solución (OOM or MM)
     * @param rules Listado de reglas post-evolucion de las celulas, utilizadas para realizar eventos postumos como addSeed o identity
     */
    constructor(
        public cells: Cell[],
        public evolution?: Evolution,
        public rules?: Rule
    ){
        this.cells = cells;
        this.evolution = (evolution === undefined)? new OnlyOneMatch() : evolution;
        this.rules = (rules === undefined)? new Identity() : rules;
    }

    /**
     * Método para realizar el match de un token con los patrones de las celulas de la solución
     * aplicando las diferentes reglas de evolución y postevolución establecidas en el sistema
     * @param token string que se desea evaluar con las celulas de la solución
     */
    match(token: string): void{
        // Realizamos copia del patrón inicial de la solución, que será utilizada por alguna reglas (ex. addSeed)
        const initialPattern: Pattern = this.cells[0].pattern;
        console.log(` Token: ${token} `);
        console.log(` Patron Inicial: ${initialPattern}`);
        // Iteramos por todos carácteres del token a evaluar o hasta que no existan más celulas en la solución
        for(let i=0; i < token.length && this.cells.length > 0;i++){
            // Obtenemos el char del token a evaluar
            let symTkn: string = token[i];
            
            // CELLS EVOLUTION
            this.cells = this.evolution.evolve(this.cells, symTkn, i);

            // RULES POST-EVOLUTION
            this.cells = this.rules.apply(this.cells, initialPattern);
        }
    }

}