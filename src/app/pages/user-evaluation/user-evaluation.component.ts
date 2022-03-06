import { Component, OnInit } from '@angular/core';
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
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


import {MatDialog} from '@angular/material/dialog';
import { GenerateInputComponent } from '../../dialogs/generate-input/generate-input.component';
import { Star } from '../../models/match-cells/patterns/star.model';
import { Plus } from '../../models/match-cells/patterns/plus.model';
import { AddRuleComponent } from '../../dialogs/add-rule/add-rule.component';
import { ComposableRule } from '../../models/match-cells/rules/composablerule.model';
import { CustomRule } from '../../models/match-cells/rules/customrule.model';
import { ErrorMessage } from 'src/app/models/errormessage.interface';
import { MatchView } from 'src/app/models/matchview.interface';
import { TraceLife } from '../../models/match-cells/rules/tracelife.model';
import { AddSeedCustom } from 'src/app/models/match-cells/rules/addseedcustom.model';
import { ComposableEvolution } from '../../models/match-cells/evolution/composableevolution.model';
import { AddEvolutionComponent } from '../../dialogs/add-evolution/add-evolution.component';
import { CustomEvolution } from '../../models/match-cells/evolution/customevolution.model';
import { InfoPageComponent } from 'src/app/dialogs/info-page/info-page.component';
import { AlwaysSeed } from '../../models/match-cells/rules/alwaysseed.model';
import informationJson from '../../../assets/data/information.json';
import { IdentityMatch } from '../../models/match-cells/evolution/identityMatch.model';
import { MenuTestComponent } from '../../dialogs/menu-test/menu-test.component';
import { SummaryTestsComponent } from '../../dialogs/summary-tests/summary-tests.component';
import { IUserTest } from '../../interfaces/IUserTest';

@Component({
  selector: 'app-user-evaluation',
  templateUrl: './user-evaluation.component.html',
  styleUrls: ['./user-evaluation.component.css']
})
export class UserEvaluationComponent implements OnInit {

  evolution_list: any[] = [
    {
      name: "Identity Match",
      checked: false,
      deletable: false,
      labelPosition: "after",
      rule: new IdentityMatch()
    },
    {
      name: "Only One Match",
      checked: true,
      deletable: false,
      labelPosition: "after",
      rule: new OnlyOneMatch()
    },
    {
      name: "Multiple Match",
      checked: false,
      deletable: false,
      labelPosition: "after",
      rule: new MultipleMatch()
    }
  ]

  master_checked: boolean = false;
  master_indeterminate: boolean = true;

  _match_complete: boolean = false;
  _input: string = '';
  _token: string = '';
  _tokenCustomAddSeed: string = 'x';
  
  _regexActivate: boolean = false;
  _regexActivateCustomAddSeed: boolean = false;
  _regexErrorValidator: ErrorMessage = {
    text: '',
    active: false
  }

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
    },
    {
      name: "Add Seed",
      disabled: false,
      checked: false,
      deletable: false,
      labelPosition: "after",
      rule: new AddSeed()
    },
    {
      name: "Always Seed",
      disabled: false,
      checked: false,
      deletable: false,
      labelPosition: "after",
      rule: new AlwaysSeed()
    },
    {
      name: "Custom Add Seed",
      disabled: false,
      checked: false,
      deletable: false,
      labelPosition: "after",
      rule: new AddSeedCustom(this._tokenCustomAddSeed)
    },
    {
      name: "Trace Life",
      disabled: false,
      checked: false,
      deletable: false,
      labelPosition: "after",
      rule: new TraceLife()
    }
  ];
  
  _matchViews: MatchView[] = [];

  _matchTime: number = SingletonOffline.getInstance().TimeInformation().matchTime;
  _lifeTime: number = SingletonOffline.getInstance().TimeInformation().lifeTime;
  
  currentTestId = -1;

  _testInformation: IUserTest[] = [
    {
      id: 1,
      name: 'Test 1',
      icon: 'looks_one',
      content: 'CONTENT TEST 1',
      input: 'AAAA',
      started: false,
      completed: false,
      failed: false,
    },
    {
      id: 2,
      name: 'Test 2',
      icon: 'looks_two',
      content: 'CONTENT TEST 2',
      input: 'BCD',
      started: false,
      completed: false,
      failed: false,
    },
    {
      id: 3,
      name: 'Test 3',
      icon: 'looks_3',
      content: 'CONTENT TEST 3',
      input: 'FFDFS',
      started: false,
      completed: false,
      failed: false,
    },
    {
      id: 4,
      name: 'Test 4',
      icon: 'looks_4',
      content: 'CONTENT TEST 4',
      input: 'SAFSAFAS',
      started: false,
      completed: false,
      failed: false,
    },
    {
      id: 5,
      name: 'Test 5',
      icon: 'looks_5',
      content: 'CONTENT TEST 5',
      input: 'SDAS3CDsd',
      started: false,
      completed: false,
      failed: false,
    },
  ];

  _testResume: any = {
    name: "Resumen de Tests",
    icon: 'summarize'
  }

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
  }

  openTestDialog(test: any): void {
    const dialogRef = this.dialog.open(MenuTestComponent, {
      width: '500px',
      data: test
    });

    dialogRef.afterClosed().subscribe((result: { id: number, content: IUserTest }) => {
      if(!result) return;
      const { id, content } = result;
      this._input = content.input;
      this.currentTestId = id;
      const idxTest = this._testInformation.findIndex((test) => test.id == content.id);
      this._testInformation[idxTest] = content;
      if(id != -1){
        this._token = '';
        this._match_complete = false;
      }
    });
  }

  openSummaryTests(): void {
    const dialogRef = this.dialog.open(SummaryTestsComponent, {
      width: '500px',
      data: this._testInformation
    });

    dialogRef.afterClosed().subscribe(result => {
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
        let customObj = {
          name: result.name,
          disabled: false,
          checked: false,
          deletable: true,
          labelPosition: "after",
          rule: customRule
        };
        this.checkbox_list.push(customObj);
      }
    });
  }

  openAddEvolutionDialog(): void {
    const dialogRef = this.dialog.open(AddEvolutionComponent, {
      width: '600px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        // xd
        const customRule: CustomEvolution = new CustomEvolution(result.name, result.js);
        let customObj = {
          name: result.name,
          checked: false,
          deletable: true,
          labelPosition: "after",
          rule: customRule
        };
        this.evolution_list.push(customObj);
      }
    });
  }

  deleteRule(index: number){
    this.checkbox_list.splice(index,1);
  }

  deleteEvolution(index: number){
    this.evolution_list.splice(index,1);
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

  generateInitialPattern(token: string): Pattern{
    if(!this.validateTraceTimeSolution()){
      return null;
    }
    if(this._regexActivate){
      return this.generateRegexPattern(token);
    }else{
      return this.generateNoRegexPattern(token);
    }
  }
  
  generateNoRegexPattern(token: string): Pattern{
    let tokenArr: string[] = [...token];
    let tokenPattern: Pattern;
    if(tokenArr.length == 1){
      tokenPattern = new Symbol(tokenArr[0]);
    }else{
      // Generamos una sequence con los 2 primeros token del array
      tokenPattern = new Sequence(new Symbol(tokenArr[0]), new Symbol(tokenArr[1]));
      for (let index = 2; index < tokenArr.length; index++) {
        tokenPattern = new Sequence(tokenPattern, new Symbol(tokenArr[index]));
      }
    }
    return tokenPattern;
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

  validateTokenRegex(token: string): boolean{
    // validar si es solo un elemento (length == 0) que no sea + * ( ) { } [ ]
    if(token.length == 1 && this.findCharWithArray(token[0],['+','*','(',')'])){
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
    let evolution_list: Evolution[] = [];
    for (const item of this.evolution_list) {
      if(item.checked){
        evolution_list.push(item.rule);
      }
    }
    this._evolutionRule = new ComposableEvolution(evolution_list);
    if(evolution_list.length === 0){
      this._regexErrorValidator = {
        text: 'Select at least one cell evolution rule',
        active: true
      }
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
    this._tokenPattern = this.generateInitialPattern(this._token);

    this.generateEvolutionRule();
    
    this.generatePostEvolutionRute();

    if(!this._regexErrorValidator.active){
      
      this.setTimerSolution();
  
      const solution = new Solution([new Cell(this._tokenPattern, new MetaInformation(0))],this._evolutionRule, this._postEvolutionRule);

      solution.match(this._input);

      this.getInformationInputMatch();

      this._match_complete = true;
    }

  }

  setTimerSolution(){
    SingletonOffline.getInstance().SetTimeMatch(this._matchTime);
    SingletonOffline.getInstance().SetLifeTime(this._lifeTime);
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

  validateTraceLifeConfig(){
    return !this._matchTime || this._matchTime <= 0 || !this._lifeTime || this._lifeTime <= 0;
  }

  validateTraceTimeSolution(): boolean{
    // validator trace timers
    if(this.validateTraceLifeConfig()){
      this._regexErrorValidator = {
        text: 'Not valid trace timers configuration',
        active: true
      }
      return false;
    }

    return true;
  }

  generateRegexPattern(_token: string): Pattern{
    // IF ERRORS
    if(!this.validateTokenRegex(_token)){
      return;
    }
    // IF TOKEN DOESN'T HAVE * or + pattern just use the other method
    if(!this.findCharWithArray('*',[..._token]) && !this.findCharWithArray('+', [..._token])){
      // DELETE BRANCHES AND WORK LIKE A NORMAL STRING
      const token = _token.replace(/[-+()\s]/g, '');
      return this.generateNoRegexPattern(token);
    }else{
      const MAX_LENGTH: number = _token.length;
      let token_array_regex = [..._token];
      let tokenPattern: Pattern = null;
      // Ver caso especial de (...)*, siendo (abcdf)* || (acv)*
      if(token_array_regex[0] == '(' && 
         token_array_regex[MAX_LENGTH - 2] == ')' &&
         this.findCharWithArray(token_array_regex[MAX_LENGTH - 1],['*','+']) &&
         !this.findCharWithArray('*', token_array_regex.slice(1, MAX_LENGTH-2)) && 
         !this.findCharWithArray('+', token_array_regex.slice(1, MAX_LENGTH-2)) &&
         !this.findCharWithArray('(', token_array_regex.slice(1, MAX_LENGTH-2)) &&
         !this.findCharWithArray(')', token_array_regex.slice(1, MAX_LENGTH-2))
      ){
        tokenPattern = (token_array_regex[MAX_LENGTH-1] == '*')?
              new Star(this.generateInnerPattern(token_array_regex.slice(1,MAX_LENGTH-2)))
              :
              new Plus(this.generateInnerPattern(token_array_regex.slice(1,MAX_LENGTH-2)));
        return tokenPattern;
      }
      // Sera siempre una secuencia de tipo
      // Al comenzar el token puede ser de 2 formas
      // a... ||  b... || f... comenzando por alguna letra
      // o
      // empezando por ( para indicar que es clausura o clausura positiva
      let second_position: number = 0;
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
      tokenPattern = new Sequence(pattern_left,pattern_right);
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
        tokenPattern = new Sequence(tokenPattern, pattern_right);
      }

      return tokenPattern;
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

  disableBtnCustomAddSeed():boolean{
    return !this._tokenCustomAddSeed || 
            this._tokenCustomAddSeed === '';
  }

  setPatternCustomAddSeedSelected(){
    let customAddSeed = this.checkbox_list.find((item) => item.name == 'Custom Add Seed');
    let newPattern: Pattern = this._regexActivateCustomAddSeed
                              ? 
                              this.generateRegexPattern(this._tokenCustomAddSeed.toLowerCase().split(" ").join(""))
                              :
                              this.generateNoRegexPattern(this._tokenCustomAddSeed.toLowerCase().split(" ").join(""));
    customAddSeed.rule = new AddSeedCustom(this._tokenCustomAddSeed, newPattern);
    console.log(customAddSeed.rule);
  }

  customAddSeedSelected(){
    const customAddSeed = this.checkbox_list.find((item) => item.name == 'Custom Add Seed');
    return customAddSeed.checked;
  }

  traceLifeConfigSelected(){
    const traceLifeCheck = this.checkbox_list.find((item) => item.name == 'Trace Life');
    return traceLifeCheck.checked;
  }

  disableMatchButton(){
    return this._token == '' || this._input == '' ||
          (this.traceLifeConfigSelected() && this.validateTraceLifeConfig());
  }

  showOptions(event){
    if(event.checked){
      this.openInformationDialog('regex');
    }
  }

  openInformationDialog(type: string): void {
    const data: any = informationJson[type];
    const title: string = data.title;
    const parrafos: string[] = data.description;
    const list: string [] = data.items;
    const dialogRef = this.dialog.open(InfoPageComponent, {
      width: '600px',
      data: {
        title, 
        parrafos,
        list
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  drop(list: any[], event: CdkDragDrop<any[]>) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }

}
