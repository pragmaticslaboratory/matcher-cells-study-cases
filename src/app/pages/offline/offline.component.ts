import { Component} from '@angular/core';
import { Cell } from 'src/app/models/match-cells/cell.model';
import { Evolution } from 'src/app/models/match-cells/evolution/evolution.interface';
import { MultipleMatch } from 'src/app/models/match-cells/evolution/multipleMatch.model';
import { OnlyOneMatch } from 'src/app/models/match-cells/evolution/onlyOneMatch.model';
import { MetaInformation } from 'src/app/models/match-cells/metaInformationModel';
import { Pattern } from 'src/app/models/match-cells/patterns/pattern.interface';
import { Sequence } from 'src/app/models/match-cells/patterns/sequence.model';
import { Symbol } from 'src/app/models/match-cells/patterns/symbol.model';
import { AddSeed } from 'src/app/models/match-cells/rules/addseed.model';
import { Identity } from 'src/app/models/match-cells/rules/identity.model';
import { Rule } from 'src/app/models/match-cells/rules/rule.interface';
import { Solution } from 'src/app/models/match-cells/solution.model';
import { SingletonOffline } from '../../models/singletonOffline.model';


import {MatDialog} from '@angular/material/dialog';
import { GenerateInputComponent } from '../../dialogs/generate-input/generate-input.component';
import { Star } from '../../models/match-cells/patterns/star.model';
import { Plus } from '../../models/match-cells/patterns/plus.model';
import { AddRuleComponent } from '../../dialogs/add-rule/add-rule.component';
import { ComposableRule } from '../../models/match-cells/rules/composablerule.model';
import { CustomRule } from '../../models/match-cells/rules/customrule.model';



interface MatchView{
  text: string,
  active: boolean
}

interface ErrorMessage{
  text: string,
  active: boolean
}


@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.css']
})
export class OfflineComponent {

  favoriteSeason: string = 'Only One Match';
  seasons: string[] = ['Only One Match', 'Multiple Match'];

  master_checked: boolean = false;
  master_indeterminate: boolean = true;

  _match_complete: boolean = false;
  _input: string = '';
  _token: string = '';
  
  
  _regexActivate: boolean = false;
  _regexErrorValidator: ErrorMessage = {
    text: '',
    active: false
  }

  _tokenArr: string[] = [];
  _tokenPattern: Pattern = null;
  _evolutionRule: Evolution = null;
  _postEvolutionRule: Rule = null;


  checkbox_list = [
    {
      name: "Identity",
      disabled: true,
      checked: true,
      deletable: false,
      labelPosition: "after",
      rule: new Identity()
    }, {
      name: "Add Seed",
      disabled: false,
      checked: false,
      deletable: false,
      labelPosition: "after",
      rule: new AddSeed()
    }
  ];
  
  _matchViews: MatchView[] = [];

  constructor(public dialog: MatDialog) {}

  openGenerateInputDialog(): void {
    const dialogRef = this.dialog.open(GenerateInputComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this._input = result;
      }
    });
  }

  openAddRuleDialog(): void {
    const dialogRef = this.dialog.open(AddRuleComponent, {
      width: '600px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        // xd
        const customRule: CustomRule = new CustomRule(result.name, result.js);
        this.checkbox_list.push({
          name: result.name,
          disabled: false,
          checked: false,
          deletable: true,
          labelPosition: "after",
          rule: customRule
        })
      }
    });
  }

  deleteRule(index: number){
    this.checkbox_list.splice(index,1);
  }

  master_change() {
    for (let value of Object.values(this.checkbox_list)) {
      if(value.disabled){
        continue;
      }
      value.checked = this.master_checked;
    }
  }

  list_change(){
    let checked_count = 0;
    //Get total checked items
    for (let value of Object.values(this.checkbox_list)) {
      if(value.checked){
        checked_count++;
      }
    }

    if(checked_count>0 && checked_count<this.checkbox_list.length){
      // If some checkboxes are checked but not all; then set Indeterminate state of the master to true.
      this.master_indeterminate = true;
    }else if(checked_count == this.checkbox_list.length){
      //If checked count is equal to total items; then check the master checkbox and also set Indeterminate state to false.
      this.master_indeterminate = false;
      this.master_checked = true;
    }else{
      //If none of the checkboxes in the list is checked then uncheck master also set Indeterminate to false.
      this.master_indeterminate = false;
      this.master_checked = false;
    }
  }

  generateInitialPattern(){
    if(this._regexActivate){
      this.generateRegexPattern();
    }else{
      this.generateNoRegexPattern(this._token);
    }
  }
  
  generateNoRegexPattern(token: string){
    this._tokenArr = [...token];

    if(this._tokenArr.length == 1){
      this._tokenPattern = new Symbol(this._tokenArr[0]);
    }else{
      // Generamos una sequence con los 2 primeros token del array
      this._tokenPattern = new Sequence(new Symbol(this._tokenArr[0]), new Symbol(this._tokenArr[1]));
      for (let index = 2; index < this._tokenArr.length; index++) {
        this._tokenPattern = new Sequence(this._tokenPattern, new Symbol(this._tokenArr[index]));
      }
    }
  }

  findCharWithArray(char: string, array: string[]): boolean{
    return array.findIndex((item) => {
      return item === char;
    }) != -1;
  }

  validateBracesTokenRegex(){
    let braces: number = 0;
    let innerElements: number = 0;
    for (let i = 0; i < this._token.length; ++i) {
      const curCh = this._token[i];
      if (curCh == '(') {
          braces++;
          continue;
      } else if (curCh == ')') {
          braces--;
          if(braces < 0 || (braces == 0 && innerElements == 0)) return false;
      }
      // TIENE QUE HABER UN ELEMENTO ENTRE MEDIO DE LOS BRACES COMO POR EJEMPLO (abc) ((ac)) para evitar los () ((()))
      if(braces > 0 && !this.findCharWithArray(curCh, ['(',')'])){
        innerElements++;
      }
    }
    if (braces != 0) {
      return false;
    }
    return true;
  }

  validateTokenRegex(): boolean{
    // validar si es solo un elemento (length == 0) que no sea + * ( ) { } [ ]
    if(this._token.length == 1 && this.findCharWithArray(this._token[0],['+','*','(',')'])){
      this._regexErrorValidator = {
        text: 'Token no valid. Remember the characters ( )* or ( )+ are reserved',
        active: true
      }
      return false;
    }
    // validator parenthesis
    if(!this.validateBracesTokenRegex()){
      this._regexErrorValidator = {
        text: 'Token no valid. Not valid parenthesis decorator',
        active: true
      }
      return false;
    }

    return true;
  }


  generateEvolutionRule(){
    if(this.favoriteSeason === 'Only One Match'){
      this._evolutionRule = new OnlyOneMatch();
    }else{
      this._evolutionRule = new MultipleMatch();
    }
  }

  generatePostEvolutionRute(){
    let rule_list: Rule[] = [];
    for (const item of this.checkbox_list) {
      if(item.checked){
        rule_list.push(item.rule);
      }
    }
    this._postEvolutionRule = new ComposableRule(rule_list);
   
    // si addseed esta checkeado
    // if(this.checkbox_list[1].checked){
    //   this._postEvolutionRule = new AddSeed();
    // }else{
    //   this._postEvolutionRule = new Identity();
    // }
  }

  resetErrorValidator(){
    this._regexErrorValidator = {
      text: '',
      active: false
    }
  }

  matchProcess(){
    this._match_complete = false;
    this.resetErrorValidator();
    SingletonOffline.getInstance().Reset();

    this.generateInitialPattern();

    if(!this._regexErrorValidator.active){
      this.generateEvolutionRule();
    
      this.generatePostEvolutionRute();

      const solution = new Solution([new Cell(this._tokenPattern, new MetaInformation(0))],this._evolutionRule, this._postEvolutionRule);

      solution.match(this._input);

      this.getInformationInputMatch();

      this._match_complete = true;
    }

  }

  getInformationInputMatch(){
    this._matchViews = [];
    for(let index=0; index < this._input.length; index++){
      this._matchViews.push({
        text: this._input[index],
        active: this.getMatches().findIndex((item) => index === item.index) != -1
      })
    }
  }

  getMatches(){
    return SingletonOffline.getInstance().Matches();
  }


  generateRegexPattern(){
    // IF ERRORS
    if(!this.validateTokenRegex()){
      return;
    }
    // IF TOKEN DOESN'T HAVE * or + pattern just use the other method
    if(!this.findCharWithArray('*',[...this._token]) && !this.findCharWithArray('+', [...this._token])){
      // DELETE BRANCHES AND WORK LIKE A NORMAL STRING
      const token = this._token.replace(/[-+()\s]/g, '');
      this.generateNoRegexPattern(token);
    }else{
      const MAX_LENGTH: number = this._token.length;
      let token_array_regex = [...this._token];

      // Ver caso especial de (...)*, siendo (abcdf)* || (acv)*
      if(token_array_regex[0] == '(' && 
         this.findCharWithArray(token_array_regex[MAX_LENGTH - 1],['*','+'])
      ){
        this._tokenPattern = (token_array_regex[MAX_LENGTH-1] == '*')?
              new Star(this.generateInnerPattern(token_array_regex.slice(1,MAX_LENGTH-2)))
              :
              new Plus(this.generateInnerPattern(token_array_regex.slice(1,MAX_LENGTH-2)));
        return;
      }
      // Sera siempre una secuencia de tipo
      // Al comenzar el token puede ser de 2 formas
      // a... ||  b... || f... comenzando por alguna letra
      // o
      // empezando por ( para indicar que es clausura o clausura positiva
      let second_position: number = 0;
      this._tokenPattern = null;
      let pattern_left: Pattern = null;
      let pattern_right: Pattern = null
      
      // first
      if(token_array_regex[0] != '('){
        pattern_left = new Symbol(token_array_regex[0]);
        second_position = 1;
      }else{
        // es un clausura ( ... )*
        // debemos encontrar el paretensis derecho o el coso de )
        let first_end: number = token_array_regex.findIndex((item, index) => {
          if(index > 0 && item == ')'){
            return index;
          }
        });
        // hace referencia al valor que esta a la derecha de la paretensis de cierre
        let star_clausure_first: boolean = token_array_regex[first_end + 1] == '*';
        let token_inner_first = token_array_regex.slice(1,first_end);
        let pattern_inner_first: Pattern = this.generateInnerPattern(token_inner_first);
        pattern_left = (star_clausure_first)?
                        new Star(
                          pattern_inner_first
                        )
                        :
                        new Plus(
                          pattern_inner_first
                        );
        second_position = first_end + 2;
      }

      let actual_position: number = 0;

      // second
      if(token_array_regex[second_position] != '('){
        pattern_right = new Symbol(token_array_regex[second_position]);
        actual_position = second_position + 1;
      }else{
        // es un clausura ( ... )*
        // debemos encontrar el paretensis derecho o el coso de )
        let second_end: number = token_array_regex.findIndex((item, index) => {
          if(index > second_position && item == ')'){
            return index;
          }
        });
        
        
        // hace referencia al valor que esta a la derecha de la paretensis de cierre
        let star_clausure_second: boolean = token_array_regex[second_end + 1] == '*';
        let token_inner_second = token_array_regex.slice(second_position+1,second_end);
        let pattern_inner_second: Pattern = this.generateInnerPattern(token_inner_second);
        pattern_right = (star_clausure_second)?
                        new Star(
                          pattern_inner_second
                        )
                        :
                        new Plus(
                          pattern_inner_second
                        );
        actual_position = second_end + 2;
      }
      // Generamos una sequence con los 2 primeros token del array
      this._tokenPattern = new Sequence(pattern_left,pattern_right);
      // ahora solo right pattern
      for (let index = actual_position; index < MAX_LENGTH;) {
        // DERECHO
        if(token_array_regex[index] != '('){
          pattern_right = new Symbol(token_array_regex[index]);
          index++;
        }else{
          // es un clausura ( ... )*
          // debemos encontrar el paretensis derecho o el coso de )
          let end: number = token_array_regex.findIndex((item, idx) => {
            if(idx > index && item == ')'){
              return idx;
            }
          });
          // hace referencia al valor que esta a la derecha de la paretensis de cierre
          let star_clausure: boolean = token_array_regex[end + 1] == '*';
          let token_inner = token_array_regex.slice(index+1,end);
          let pattern_inner: Pattern = this.generateInnerPattern(token_inner);
          pattern_right = (star_clausure)?
                          new Star(
                            pattern_inner
                          )
                          :
                          new Plus(
                            pattern_inner
                          );
          index = end + 2;
        }
        this._tokenPattern = new Sequence(this._tokenPattern, pattern_right);
      }
    }
  }

  generateInnerPattern(array: string[]): Pattern{
    if(array.length == 1){
      return new Symbol(array[0]);
    }else{
      // Generamos una sequence con los 2 primeros token del array
      let patter_inner = new Sequence(new Symbol(array[0]), new Symbol(array[1]));
      for (let index = 2; index < array.length; index++) {
        patter_inner = new Sequence(patter_inner, new Symbol(array[index]));
      }
      return patter_inner;
    }
  }
}
