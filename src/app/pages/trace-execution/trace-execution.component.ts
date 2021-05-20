import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-trace-execution',
  templateUrl: './trace-execution.component.html',
  styleUrls: ['./trace-execution.component.css']
})
export class TraceExecutionComponent implements OnInit, OnDestroy {

  timerBase: number = 20;
  timerQuestions: number = this.timerBase;
  valuesQuestion: number[] = [1, 2];
  textValidation: string = '';
  answer: number = 0;

  timer = setInterval(() => { 
    if(this.timerQuestions > 0){
      this.timerQuestions--;
    }else{
      this.timerQuestions = this.timerBase;
    }
  } , 1000);

  constructor() { }

  ngOnInit(): void {
    this.generateNewQuestion();
  }

  generateNewQuestion(){
    this.valuesQuestion = [ this.getRandomInt(10), this.getRandomInt(10) ];
  }

  skip(){
    this.generateNewQuestion();
  }

  isCorrectAnswer(){
    return this.answer === ( this.valuesQuestion[0] + this.valuesQuestion[1] );
  }

  verify(){
    
    console.log(this.valuesQuestion);
    console.log(this.answer);
    console.log(this.isCorrectAnswer())
    if(this.isCorrectAnswer()){
      this.textValidation = 'CORRECTO';
    }else{
      this.textValidation = 'INCORRECTO';
    }
  }

  validAnswerBtn(){
    return this.answer !== null || this.answer.toString().length == 0;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

}
