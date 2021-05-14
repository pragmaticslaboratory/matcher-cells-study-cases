/******************************
 * IMPORTS
 ******************************/
 import { Rule } from './rule.interface';
 import { Cell } from '../cell.model';
 import { Pattern } from '../patterns/pattern.interface';
import { SingletonOffline } from '../../singletonOffline.model';
 
 export class TraceLife implements Rule{
     
     /**
      * Función para aplicar una regla a un listado de celulas y generar la post evolución de la solución
      * @param cells listado de celulas a evaluar
      * @param pattern patron inicial de la solución
      * @returns Verifica si el tiempo de las vidas de celula
      */
     apply(cells: Cell[], pattern: Pattern): Cell[]{
         return this.killByTraceLife() ? [] : cells;
     }

     /**
      * Función que verifica si el contador de trazado de vida entre los match de la solución
      * @returns verifica si la solución ya no es valida para los parametros establecidos para se eliminada
      */
     killByTraceLife(): boolean{
        return SingletonOffline.getInstance().TimeInformation().activeTrace &&
               (SingletonOffline.getInstance().TimeInformation().lifeTime - SingletonOffline.getInstance().TimeInformation().currentTime) <= 0;
     }
 }