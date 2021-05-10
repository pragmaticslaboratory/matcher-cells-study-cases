/******************************
 * IMPORTS
 ******************************/
 import { Rule } from './rule.interface';
 import { Cell } from '../cell.model';
 import { Pattern } from '../patterns/pattern.interface';
import { Sequence } from '../patterns/sequence.model';
import { Symbol } from '../patterns/symbol.model';
import { MetaInformation } from '../metaInformationModel';
import { Star } from '../patterns/star.model';
import { Plus } from '../patterns/plus.model';
 
 export class CustomRule implements Rule{
    
    /**
     * Objeto de contexto para la evaluacion de la función custom de la regla
     */
    contextObj = {
        Sequence: (x,y) => { return new Sequence(x,y)},
        Cell: (x, y) => { return new Cell(x, y)},
        Symbol: (x) => {return new Symbol(x)},
        MetaInformation: (x) => { return new MetaInformation(x)},
        Star: (x) => {return new Star(x)},
        Plus: (x) => {return new Plus(x)}
    };

    /**
     * Constructor
     * @param nameRule nombre de la nueva regla
     * @param evaluateFunction funcion de evaluación a ejecutar
     */
    constructor(
        public nameRule: string = 'New Rule',
        public evaluateFunction: string = ''
    ){
        this.nameRule = nameRule;
        this.evaluateFunction = evaluateFunction;
    }

     /**
      * Función para aplicar una regla personalizada a un listado de celulas y generar la post evolución de la solución
      * @param cells listado de celulas a evaluar
      * @param pattern patron inicial de la solución
      * @returns retorna el mismo listado de celulas 
      */
    apply(cells: Cell[], pattern: Pattern): Cell[]{
        return this.expressionInterpreter(this.evaluateFunction, cells, pattern);;
    }

    /**
     * Funcion que evalua la función de la evaluación asociada a esta regla personalizada de la solución
     * @param expresion regla personalizada. ex: Cell(Sequence(Symbol('x'),Symbol('y')), null)
     * @returns la evaluación de dicha expresión
     */
    expressionInterpreter(expresion: string, cells: Cell[], pattern: Pattern) {
        let result;
        try {
            result = this.evalInContext(expresion, cells, pattern);
        } catch (error) {
            console.error(error);
            throw error;  
        }
        return result;
    }

    /**
     * Funcion que transforma una evaluación de string a un formato funcional.
     * @param js string a evaluar
     */
    evalInContext = (js: string, cells: Cell[], pattern: Pattern) => {
        let keys = Object.keys(this.contextObj);
        //let code = 'function it(){';
        let code = '';
        for (let i = 0; i < keys.length; i++){
            code += 'let '+keys[i]+' = window._evalincontextobj.'+keys[i]+';\n';
        }
        code += 'return (';
        code += js;
        code += ')';//}\n return it();';
        window['_evalincontextobj'] = this.contextObj;
        let res = Function(code)();
        console.log(js+' = '+res);
        delete window['_evalincontextobj'];
        return res(cells, pattern);
    }
    
 }