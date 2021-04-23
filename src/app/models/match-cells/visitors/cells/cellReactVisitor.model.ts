/******************************
 * IMPORTS
 ******************************/
import { Cell } from "../../cell.model";
import { Advance } from "../../match_result/advance.model";
import { Match } from "../../match_result/match.model";
import { Skip } from "../../match_result/skip.model";
import { Stuck } from "../../match_result/stuck.model";

import { MetaInformation } from "../../metaInformationModel";
import { CellVisitor } from "./cellVisitor.interface";
import { SingletonOffline } from '../../../singletonOffline.model';

export class CellReactVisitor implements CellVisitor{

    constructor(
    ){

    }

    /**
     * Funcion para evaluar la rección de la clase Match
     * Se indica por consola el match del token y el indice asociado
     * @param element objeto match a evaluar
     * @param token token de evaluación de la celula (char)
     * @param index indice asociado al token
     * @returns al existir un match con el token actual, se retorna un listado de celulas vacio (que representa una celula match)
     */
    visitReactCellMatch(element: Match, token: string, index: number): Cell[] {
        this.showMatch(token, index);
        return [];
    }

    /**
     * Funcion para evaluar la rección de la clase Stuck
     * @param element objeto stuck a evaluar
     * @param cell celula actual que se encuentra en reacción 
     * @returns al ser un clase stuck, significa que no hubo coincidencia con el patron actual de la celula
     * por ello se retorna un listado de celulas con SOLO la misma celula actual para que sea evaluada con el siguiente token
     */
    visitReactCellStuck(element: Stuck, cell: Cell): Cell[] {
        return [cell];
    }

    /**
     * Funcion para evaluar la rección de la clase Advance
     * @param element objeto advance a evaluar
     * @param metaInformation Meta información asociada a la celula actual
     * @returns retorna un listado de celulas que contiene la siguiente celula con el siguiente patron a evaluar, además de 
     * pasar a la siguiente generación la información del entorno
     */ 
    visitReactCellAdvance(element: Advance, metaInformation: MetaInformation): Cell[] {
        return [new Cell(element.pattern, metaInformation)];
    }

    /**
     * Funcion para evaluar la rección de la clase Skip, para las clausuras y clausuras positivos
     * Se indica por consola el match del token y el indice asociado
     * @param element objeto match a evaluar
     * @param token token de evaluación de la celula (char)
     * @param index indice asociado al token
     * @returns al existir un skip con el token actual, se retorna un listado de celulas vacio (que representa una celula match)
     * debido a que se cumple la clausura asociada
     */
    visitReactCellSkip(element: Skip, token: string, index: number): Cell[] {
        this.showMatch(token, index);
        return [];
    }
    
    /**
     * Imprime el match de un token y su indice asociado
     * @param token token de evaluación de la celula (char)
     * @param index indice asociado al token
     */
    showMatch(token: string, index: number):void{
        SingletonOffline.getInstance().AddMatch(token,index);
        console.log(`MATCH. Symbol: ${token} ; Token Index: ${index} `);
    }
}