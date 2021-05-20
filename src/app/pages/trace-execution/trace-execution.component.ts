import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnlyOneMatch } from 'src/app/models/match-cells/evolution/onlyOneMatch.model';
import { Identity } from '../../models/match-cells/rules/identity.model';
import { Cell } from '../../models/match-cells/cell.model';
import { MetaInformation } from 'src/app/models/match-cells/metaInformationModel';
import { Symbol } from 'src/app/models/match-cells/patterns/symbol.model';
import { SingletonOffline } from 'src/app/models/singletonOffline.model';
import { Solution } from 'src/app/models/match-cells/solution.model';

const MATCH_GOOD: string = 'a';
const MATCH_BAD: string = 'b';
const MATCH_SKIP: string = 'c';
const MATCH_MEDIUM: string = 'd';

const GOOD_INFO: string = 'GOOD PERFORMANCE';
const BAD_INFO: string = 'NEED HELP';
const SKIP_INFO: string = 'STUDENT DOES NOT ANSWER EVERY QUESTION';
const MEDIUM_INFO: string = 'MEDIUM PERFORMANCE';

@Component({
  selector: 'app-trace-execution',
  templateUrl: './trace-execution.component.html',
  styleUrls: ['./trace-execution.component.css']
})
export class TraceExecutionComponent implements OnInit, OnDestroy {

  timerQuestions: number = 0;

  configTimer: any = {
    number_good_performance: 3,
    good_performance: 10,
    
    number_need_help: 3,
    need_help: 5,
    
    number_skip: 2,
    
    number_medium_performance: 4,
    medium_performance: 15
  }

  timerLast: any = {
    good: 0,
    bad: 0
  }

  mathCounter: any = {
    good: 0,
    bad: 0,
    skip: 0
  }

  matchListTimer: any = {
    good: [],
    bad: []
  }

  configUser: any = {
    number_good_performance: 3,
    good_performance: 10,
    number_need_help: 3,
    need_help: 5,
    number_skip: 2,
    number_medium_performance: 4,
    medium_performance: 15
  }

  valuesQuestion: number[] = [1, 2];
  textValidation: string = null;
  answer: number = 0;

  inputEvaluation: string = '';

  log: string[] = [];

  cellList: any[] = [];
  
  _evolutionRule = new OnlyOneMatch();
  _postEvolutionRule = new Identity();

  timer = setInterval(() => {
    this.timerQuestions++;
  } , 1000);

  constructor() {
  }

  ngOnInit(): void {
    this.setInitialUserConfig();
    this.setCellsEvaluation();
    this.generateNewQuestion();
  }

  setInitialUserConfig(){
    this.configUser = {...this.configTimer}
  }

  generateCellEvaluation(symbol: string, content: string): any{
    return {
      cell: new Cell(new Symbol(symbol), new MetaInformation(0)),
      result: content
    }
  }

  setCellsEvaluation(){
    this.cellList = [
      this.generateCellEvaluation(MATCH_GOOD, GOOD_INFO),
      this.generateCellEvaluation(MATCH_BAD, BAD_INFO),
      this.generateCellEvaluation(MATCH_SKIP, SKIP_INFO),
      this.generateCellEvaluation(MATCH_MEDIUM, MEDIUM_INFO),
    ];
  }

  generateNewQuestion(){
    this.answer = null;
    this.valuesQuestion = [ this.getRandomInt(10), this.getRandomInt(10) ];
  }

  isCorrectAnswer(){
    return this.answer === ( this.valuesQuestion[0] + this.valuesQuestion[1] );
  }

  verify(){
    if(this.isCorrectAnswer()){
      this.success();
    }else{
      this.bad();
    }
    this.processCaseStudio();
    this.generateNewQuestion();
  }

  success(){
    this.mathCounter.good +=1;
    
    let deltaTime = this.timerQuestions - this.timerLast.good;
    this.matchListTimer.good.unshift({
      deltaTime,
      time: this.timerQuestions
    });
    this.timerLast.good = this.timerQuestions;

    this.textValidation = 'GOOD';
  }

  bad(){
    this.mathCounter.bad +=1;

    let deltaTime = this.timerQuestions - this.timerLast.bad;
    this.matchListTimer.bad.unshift({
      deltaTime,
      time: this.timerQuestions
    });
    this.timerLast.bad = this.timerQuestions;

    this.textValidation = 'BAD';
  }

  skip(){
    this.textValidation = null;
    this.mathCounter.skip +=1;
    this.processCaseStudio();
    this.generateNewQuestion();
  }

  processCaseStudio(){
    this.log = [];
    this.generateInputTraceEvaluation();
    let total_matches: number = 0;
    SingletonOffline.getInstance().Reset();
    for (const cell of this.cellList) {
      let solution = new Solution([cell.cell],this._evolutionRule, this._postEvolutionRule);
      solution.match(this.inputEvaluation);
      total_matches = SingletonOffline.getInstance().Matches().length;
      if(total_matches > 0){
        this.log.push(cell.result);
      }
      SingletonOffline.getInstance().Reset();
    }
  }

  evaluationTraceByDeltaTime(){
    // Tres aciertos en un tiempo <x, log "good performance". Va al siguiente nivel  de la aplicación "suma con un digito más"
    let goodList = this.matchListTimer.good.slice(0, this.configTimer.number_good_performance);
    let totalTimeList = goodList.reduce((accumulator, currentValue) => accumulator + currentValue.deltaTime, 0);
    if(goodList.length ===  this.configTimer.number_good_performance && totalTimeList < this.configTimer.good_performance){
      this.inputEvaluation += MATCH_GOOD;
    }

    // Tres errores en un tiempo <y<x, log "need help". Baja al siguiente nivel  de la aplicación "suma con un digito menos"
    let badList = this.matchListTimer.bad.slice(0, this.configTimer.number_need_help);
    totalTimeList = badList.reduce((accumulator, currentValue) => accumulator + currentValue.deltaTime, 0);
    if(badList.length ===  this.configTimer.number_need_help && totalTimeList < this.configTimer.need_help){
      this.inputEvaluation += MATCH_BAD;
    }

    // Dos "Skip", log "student does not answer every question"
    if(this.configTimer.number_skip <= this.mathCounter.skip){
      this.inputEvaluation += MATCH_SKIP;
    }

    // Cuatro aciertos en un tiempo >z, log "medium performance".  
    goodList = this.matchListTimer.good.slice(0, this.configTimer.number_medium_performance);
    totalTimeList = goodList.reduce((accumulator, currentValue) => accumulator + currentValue.deltaTime, 0);
    if( goodList.length ===  this.configTimer.number_medium_performance && totalTimeList < this.configTimer.medium_performance){
      this.inputEvaluation += MATCH_MEDIUM;
    }
  }

  evaluationTraceByTime(){
    
  }

  generateInputTraceEvaluation(type: boolean = true){
    this.inputEvaluation = '';

    if(type){
      this.evaluationTraceByDeltaTime();
    }else{
      this.evaluationTraceByTime();
    }
  }

  setAndResetInformation(){
    this.timerQuestions = 0;
    this.timerLast = {
      good: 0,
      bad: 0
    };
    this.mathCounter = {
      good: 0,
      bad: 0,
      skip: 0
    };
    this.matchListTimer = {
      good: [],
      bad: []
    };
    this.log = [];
    this.generateNewQuestion();
  }

  validAnswerBtn(){
    return this.answer !== null || this.answer?.toString().length == 0;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

}
