import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { NgxSpinnerService } from "ngx-spinner";


import {MatDialog} from '@angular/material/dialog';
import { Star } from '../../models/match-cells/patterns/star.model';
import { Plus } from '../../models/match-cells/patterns/plus.model';
import { AddRuleComponent } from '../../dialogs/add-rule/add-rule.component';
import { ComposableRule } from '../../models/match-cells/rules/composablerule.model';
import { CustomRule } from '../../models/match-cells/rules/customrule.model';
import { Tweet } from 'src/app/models/tweet.interface';
import { ErrorMessage } from 'src/app/models/errormessage.interface';
import { MatchView } from 'src/app/models/matchview.interface';
import { ChipToken } from '../../models/match-cells/chiptoken.interface';
import { AddSeedCustom } from 'src/app/models/match-cells/rules/addseedcustom.model';
import { TraceLife } from 'src/app/models/match-cells/rules/tracelife.model';

import tweetJson from '../../../assets/data/tweets.json';
import { InfoPageComponent } from 'src/app/dialogs/info-page/info-page.component';
import { CustomEvolution } from 'src/app/models/match-cells/evolution/customevolution.model';
import { AddEvolutionComponent } from 'src/app/dialogs/add-evolution/add-evolution.component';
import { ComposableEvolution } from 'src/app/models/match-cells/evolution/composableevolution.model';
import { AlwaysSeed } from '../../models/match-cells/rules/alwaysseed.model';
import informationJson from '../../../assets/data/information.json';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IdentityMatch } from '../../models/match-cells/evolution/identityMatch.model';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
  ],
})
export class TwitterComponent implements OnInit, OnDestroy  {

  newSequence: string = '';

  tweetsData: any[] = tweetJson.data;
  
  tweetList: Tweet[] = [];

  newTimer: number = 10;
  timeToGenerate: number = 10;
  timerGenerate: number = this.timeToGenerate;

  // OLD STUFF

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
  _match_in_process: boolean = false;
  _input: string = '';
  _token: string = '';
  _tokenCustomAddSeed: string = 'x';

  _matchTime: number = SingletonOffline.getInstance().TimeInformation().matchTime;
  _lifeTime: number = SingletonOffline.getInstance().TimeInformation().lifeTime;

  _formatPattern: boolean = false;
  _regexActivate: boolean = false;
  _regexActivateCustomAddSeed: boolean = false;

  _regexErrorValidator: ErrorMessage = {
    text: '',
    active: false
  }

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

  availableColors: ChipToken[] = [];


  generateTweetInterval = setInterval(() => { 
    if(this.timerGenerate > 0){
      this.timerGenerate--;
    }else{
      this.generateTweet();
    }
  } , 1000);

  constructor(
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    for(let i=0; i < 4; i++){
      this.generateTweet(false);
    }
  }

  generateTweet(do_match: boolean = true){
    this.timerGenerate = this.timeToGenerate;
    let tweet = this.tweetsData[this.getRandomInt(this.tweetsData.length)];
    this.tweetList.unshift({
      username: tweet.username,
      content: tweet.content,
      handle: tweet.handle,
      hashtag: [],
      match: false,
      total: 0,
      image: tweet.image
    });
    if(do_match && this.availableColors.length != 0){
      this.matchProcess();
    }
  }

  setTimerGenerator(){
    if(this.newTimer && this.newTimer >= 1){
      this.timeToGenerate = this.newTimer;
      this.timerGenerate = this.timeToGenerate;
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
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

  addSequence(){
    if(this.newSequence === "") return;

    this.availableColors.unshift(
      {
        name: this.newSequence.toLowerCase().split(" ").join(""),
        pattern: this._regexActivate ? 
        this.generateRegexPattern(this.newSequence.toLowerCase().split(" ").join(""))
        :
        this.generateNoRegexPattern(this.newSequence.toLowerCase().split(" ").join("")),
        color: undefined
      }
    );
    this.newSequence = "";
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

  validateBracesTokenRegex(token: string){
    let braces: number = 0;
    let innerElements: number = 0;
    for (let i = 0; i < token.length; ++i) {
      const curCh = token[i];
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
    if(token.length == 1 && this.findCharWithArray(token,['+','*','(',')'])){
      this._regexErrorValidator = {
        text: 'Token no valid. Remember the characters ( )* or ( )+ are reserved',
        active: true
      }
      return false;
    }
    // validator parenthesis
    if(!this.validateBracesTokenRegex(token)){
      this._regexErrorValidator = {
        text: 'Token no valid. Not valid parenthesis decorator',
        active: true
      }
      return false;
    }

    return true;
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
        });
      }
    });
  }
  
  remove(chip: string): void {
    const index = this.availableColors.findIndex(item => item.name == chip);

    if (index >= 0) {
      this.availableColors.splice(index, 1);
      this.resetTweetStatus();
    }
  }

  async matchProcess(){
    this.spinner.show();
    this._match_complete = false;
    this._match_in_process = true;
    this.resetTweetStatus();

    this.generateEvolutionRule();
    
    this.generatePostEvolutionRute();

    let cellList: Cell[] = [];

    for (const chiptoken of this.availableColors) {
      cellList.push(
        new Cell(chiptoken.pattern, new MetaInformation(0)
      ));
    }

    for (const tweet of this.tweetList) {
      SingletonOffline.getInstance().Reset();
      let total_matches: number = 0;
      let solution: Solution;
      for (const item of this.evolution_list) {
        if(item.checked){
          if(item.rule instanceof OnlyOneMatch){
            for (const cell of cellList) {
              solution = new Solution([cell],item.rule, this._postEvolutionRule);
              solution.match(tweet.content.toLowerCase().split(" ").join(""));
              total_matches += SingletonOffline.getInstance().Matches().length;
              SingletonOffline.getInstance().Reset();
            }
          }else{
            solution = new Solution([...cellList],item.rule, this._postEvolutionRule);
            solution.match(tweet.content.toLowerCase().split(" ").join(""));
            total_matches += SingletonOffline.getInstance().Matches().length;
            SingletonOffline.getInstance().Reset();
          }
        }
      }
      tweet.match = total_matches != 0;
      tweet.total = total_matches;
    }

    this._match_in_process = false;
    this._match_complete = true;
    this.spinner.hide();
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

  resetTweetStatus(){
    this.tweetList.forEach((item) => {
      item.match = false;
    });
  }

  getMatches(){
    return this.tweetList.filter((item) => item.match).length;
  }

  ngOnDestroy() {
    clearInterval(this.generateTweetInterval);
  }

  customAddSeedSelected(){
    const customAddSeed = this.checkbox_list.find((item) => item.name == 'Custom Add Seed');
    return customAddSeed.checked;
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

  deleteEvolution(index: number){
    this.evolution_list.splice(index,1);
  }

  openInformationCaseStudyDialog(): void {
    const parrafos: string[] = [
      "Twitter (Case Study 1). Matcher Cells allows developers to identify a set of tweets that are streaming on the fly. This case study is a Web application that uses Matcher Cells that identify tweets utilizing the composition of different rules of cell and solution evolutions. A particular composition represents a specific matching semantics that can be modified in the execution time with a pattern.",
      "For this case study, we collect 1,000 tweets that are related to the video game subject. A tweet from this collection appears in an interval of n seconds. The user of this application can specify a pattern (using regular expression or not) and a particular semantics to match tweets, which turns red."
    ];
    const list: string [] = [];
    const dialogRef = this.dialog.open(InfoPageComponent, {
      width: '600px',
      data: {
        parrafos,
        list
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  traceLifeConfigSelected(){
    const traceLifeCheck = this.checkbox_list.find((item) => item.name == 'Trace Life');
    return traceLifeCheck.checked;
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
