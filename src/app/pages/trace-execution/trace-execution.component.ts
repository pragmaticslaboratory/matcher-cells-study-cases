import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnlyOneMatch } from 'src/app/models/match-cells/evolution/onlyOneMatch.model';
import { Identity } from '../../models/match-cells/rules/identity.model';
import { Cell } from '../../models/match-cells/cell.model';
import { MetaInformation } from 'src/app/models/match-cells/metaInformationModel';
import { Symbol } from 'src/app/models/match-cells/patterns/symbol.model';
import { SingletonOffline } from 'src/app/models/singletonOffline.model';
import { Solution } from 'src/app/models/match-cells/solution.model';
import { InfoPageComponent } from '../../dialogs/info-page/info-page.component';
import { MatDialog } from '@angular/material/dialog';

const MATCH_GOOD: string = 'a';
const MATCH_BAD: string = 'b';
const MATCH_SKIP: string = 'c';
const MATCH_MEDIUM: string = 'd';

const GOOD_INFO: string = 'STUDENT HAS GOOD PERFORMANCE';
const BAD_INFO: string = 'STUDENT NEEDS HELP';
const SKIP_INFO: string = 'STUDENT DOES NOT ANSWER EVERY QUESTION';
const MEDIUM_INFO: string = 'STUDENT HAS MEDIUM PERFORMANCE';

const GOOD_INFO_SUB: string = 'UP LEVEL';
const BAD_INFO_SUB: string = 'DOWN LEVEL';
const SKIP_INFO_SUB: string = 'FIRST LEVEL';
const MEDIUM_INFO_SUB: string = 'KEEP LEVEL';

@Component({
  selector: 'app-trace-execution',
  templateUrl: './trace-execution.component.html',
  styleUrls: ['./trace-execution.component.css']
})
export class TraceExecutionComponent implements OnInit, OnDestroy {

  timerQuestions: number = 0;

  currentLevel: number = 1;

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
    skip: 0,
    medium: 0
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

  logs: string[] = [];

  cellList: any[] = [];
  
  _evolutionRule = new OnlyOneMatch();
  _postEvolutionRule = new Identity();

  timer = setInterval(() => {
    this.timerQuestions++;
  } , 1000);

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.setInitialUserConfig();
    this.setCellsEvaluation();
    this.generateNewQuestion();
  }

  setInitialUserConfig(){
    this.configUser = {...this.configTimer}
  }

  generateCellEvaluation(symbol: string, title: string, subtitle: string, image:string, css: string): any{
    return {
      cell: new Cell(new Symbol(symbol), new MetaInformation(0)),
      result: {
        title,
        image,
        subtitle,
        css
      }
    }
  }

  setCellsEvaluation(){
    this.cellList = [
      this.generateCellEvaluation(MATCH_GOOD, GOOD_INFO, GOOD_INFO_SUB, 'verified', '#00695C'),
      this.generateCellEvaluation(MATCH_BAD, BAD_INFO, BAD_INFO_SUB, 'error_outline', '#B03A2E'),
      this.generateCellEvaluation(MATCH_SKIP, SKIP_INFO, SKIP_INFO_SUB, 'mood_bad', '#2E86C1'),
      this.generateCellEvaluation(MATCH_MEDIUM, MEDIUM_INFO, MEDIUM_INFO_SUB, 'published_with_changes', '#16A085'),
    ];
  }

  generateNewQuestion(){
    this.answer = null;
    let min = Math.pow(10, (this.currentLevel - 1));
    let max = Math.pow(10, this.currentLevel);
    console.log(this.currentLevel, min, max);
    this.valuesQuestion = [ this.randomInteger(min, max), this.randomInteger(min, max) ];
  }

  isCorrectAnswer(){
    return this.answer === ( this.valuesQuestion[0] + this.valuesQuestion[1] );
  }

  verify(){
    if(!this.validAnswerBtn()){
      return
    }
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
    this.mathCounter.medium +=1;
    
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
    this.generateInputTraceEvaluation();
    let total_matches: number = 0;
    SingletonOffline.getInstance().Reset();
    for (const cell of this.cellList) {
      let solution = new Solution([cell.cell],this._evolutionRule, this._postEvolutionRule);
      solution.match(this.inputEvaluation);
      total_matches = SingletonOffline.getInstance().Matches().length;
      if(total_matches > 0){
        this.logs.unshift({...cell.result, timer: this.timerQuestions});
      }
      SingletonOffline.getInstance().Reset();
    }
  }

  evaluationTraceByDeltaTime(){
    // Tres aciertos en un tiempo <x, log "good performance". Va al siguiente nivel  de la aplicación "suma con un digito más"
    let goodList = this.matchListTimer.good.slice(0, this.configTimer.number_good_performance);
    let totalTimeList = goodList.reduce((accumulator, currentValue) => accumulator + currentValue.deltaTime, 0);
    if(goodList.length ===  this.configTimer.number_good_performance && 
      this.mathCounter.good >=  this.configTimer.number_good_performance && 
      totalTimeList < this.configTimer.good_performance
    ){
      this.currentLevel += 1;
      this.mathCounter.good = 0;
      this.inputEvaluation += MATCH_GOOD;
    }

    // Tres errores en un tiempo <y<x, log "need help". Baja al siguiente nivel  de la aplicación "suma con un digito menos"
    let badList = this.matchListTimer.bad.slice(0, this.configTimer.number_need_help);
    totalTimeList = badList.reduce((accumulator, currentValue) => accumulator + currentValue.deltaTime, 0);
    if(badList.length ===  this.configTimer.number_need_help &&
      this.mathCounter.bad >=  this.configTimer.number_need_help && 
      totalTimeList < this.configTimer.need_help
    ){
      this.currentLevel--;
      if(this.currentLevel <= 0){
        this.currentLevel = 1;
      }
      this.mathCounter.bad = 0;
      this.inputEvaluation += MATCH_BAD;
    }

    // Dos "Skip", log "student does not answer every question"
    if(this.configTimer.number_skip <= this.mathCounter.skip){
      this.currentLevel = 1;
      this.mathCounter.skip = 0;
      this.inputEvaluation += MATCH_SKIP;
    }

    // Cuatro aciertos en un tiempo >z, log "medium performance".  
    goodList = this.matchListTimer.good.slice(0, this.configTimer.number_medium_performance);
    totalTimeList = goodList.reduce((accumulator, currentValue) => accumulator + currentValue.deltaTime, 0);
    if( goodList.length ===  this.configTimer.number_medium_performance &&
      this.mathCounter.medium >=  this.configTimer.number_medium_performance && 
      totalTimeList < this.configTimer.medium_performance){
      this.mathCounter.medium = 0;
      this.inputEvaluation += MATCH_MEDIUM;
    }
  }

  evaluationTraceByTime(){
    // Tres aciertos en un tiempo <x, log "good performance". Va al siguiente nivel  de la aplicación "suma con un digito más"
    let goodList = this.matchListTimer.good.slice(0, this.configTimer.number_good_performance);
    let totalTimeList = goodList.reduce((accumulator, currentValue) => accumulator + currentValue.deltaTime, 0);
    if(goodList.length ===  this.configTimer.number_good_performance && totalTimeList < this.configTimer.good_performance){
      this.inputEvaluation += MATCH_GOOD;
    }
  }

  generateInputTraceEvaluation(){
    this.inputEvaluation = '';
    this.evaluationTraceByDeltaTime();
  }

  setAndResetInformation(){
    this.currentLevel = 1;
    this.timerQuestions = 0;
    this.timerLast = {
      good: 0,
      bad: 0
    };
    this.mathCounter = {
      good: 0,
      bad: 0,
      skip: 0,
      medium: 0
    };
    this.matchListTimer = {
      good: [],
      bad: []
    };
    this.configTimer = {...this.configUser}
    this.logs = [];
    this.generateNewQuestion();
  }

  validAnswerBtn(){
    return this.answer !== null || this.answer?.toString().length == 0;
  }

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  openInformationDialog(): void {
    const parrafos: string[] = [
      "Context-Aware System (Case Study 2). These systems can dynamically modify their behavior according to a user's needs. In this case study, we modify a Web application that assesses the math skills of primary school students to adapt to the learning rhythm of a particular student. We use Matcher Cells to identify the student's learning rhythm.",
      "For this case study, we define four adaptations for the Web application:"
    ];
    const list: string [] = [
      "If n1 correct answers in a period of time < x1, the application goes up to the next level, which increases the number of digits in the addition.",
      "If n2 wrong answers in a period of time < x2, the application goes down to the previous level, which decreases the number of digits in the addition.",
      "If n3 uses of 'Skip', the application goes down to the first level (one digit in the addition).",
      "If n4 correct answers in a period of time > x3, the application keeps the number of digits in the addition."
    ];
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

  ngOnDestroy() {
    clearInterval(this.timer);
  }

}
