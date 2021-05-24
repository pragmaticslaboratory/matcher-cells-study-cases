/******************************
 * IMPORTS
 ******************************/
import { Cell } from '../cell.model';
import { Pattern } from '../patterns/pattern.interface';
import { Sequence } from '../patterns/sequence.model';
import { Symbol } from '../patterns/symbol.model';
import { MetaInformation } from '../metaInformationModel';
import { Star } from '../patterns/star.model';
import { Plus } from '../patterns/plus.model';
import { Evolution } from './evolution.interface';
 
 export class CustomEvolution implements Evolution{
    
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
     * Función para aplicar el listado de reglas hijas a un listado de celulas y generar la evolución de las celulas
     * @param cells listado de celulas a evaluar
     * @param token token a comparar
     * @param idx indice asociado al token
     * @returns retorna el listado de celulas resultantes, una vez aplicadas el listado de reglas hijas asociadas
    */
    evolve(cells: Cell[], token: string, idx: number = 0): Cell[]{
        return this.expressionInterpreter(this.evaluateFunction, cells, token, idx);;
    }

    /**
     * Funcion que evalua la función de la evaluación asociada a esta regla personalizada de la solución
     * @param expresion regla personalizada. ex: Cell(Sequence(Symbol('x'),Symbol('y')), null)
     * @returns la evaluación de dicha expresión
     */
    expressionInterpreter(expresion: string, cells: Cell[], token: string, idx: number) {
        let result;
        try {
            result = this.evalInContext(expresion, cells, token, idx);
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
    evalInContext = (js: string, cells: Cell[], token: string, idx: number) => {
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
        return res(cells, token, idx);
    }
    
 }