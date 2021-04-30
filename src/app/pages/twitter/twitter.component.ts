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
import { GenerateInputComponent } from '../../dialogs/generate-input/generate-input.component';
import { Star } from '../../models/match-cells/patterns/star.model';
import { Plus } from '../../models/match-cells/patterns/plus.model';
import { AddRuleComponent } from '../../dialogs/add-rule/add-rule.component';
import { ComposableRule } from '../../models/match-cells/rules/composablerule.model';
import { CustomRule } from '../../models/match-cells/rules/customrule.model';
import { Tweet } from 'src/app/models/tweet.interface';
import { ErrorMessage } from 'src/app/models/errormessage.interface';
import { MatchView } from 'src/app/models/matchview.interface';
import { ChipToken } from '../../models/match-cells/chiptoken.interface';

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

  textExamples: string[] = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam ',
    'Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot Europa usa li sam vocabular. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules.',
    'Muy lejos, más allá de las montañas de palabras, alejados de los países de las vocales y las consonantes, viven los textos simulados. Viven aislados en casas de letras, en la costa de la semántica, un gran océano de lenguas. ',
    'Y, viéndole don Quijote de aquella manera, con muestras de tanta tristeza, le dijo: Sábete, Sancho, que no es un hombre más que otro si no hace más que otro. Todas estas borrascas que nos suceden son señales de que presto ha de serenar',
    'Reina en mi espíritu una alegría admirable, muy parecida a las dulces alboradas de la primavera, de que gozo aquí con delicia. Estoy solo, y me felicito de vivir en este país, el más a propósito para almas como la mía, soy tan dichoso',
    'Una mañana, tras un sueño intranquilo, Gregorio Samsa se despertó convertido en un monstruoso insecto. Estaba echado de espaldas sobre un duro caparazón y, al alzar la cabeza, vio su vientre convexo y oscuro, surcado',
    'Quiere la boca exhausta vid, kiwi, piña y fugaz jamón. Fabio me exige, sin tapujos, que añada cerveza al whisky. Jovencillo emponzoñado de whisky, ¡qué figurota exhibes! La cigüeña tocaba cada vez mejor el saxofón y el búho pedía kiwi y queso.'
  ];
  hashtagExample: string[] = ['#UCN','#PRAGMATIC','#ULS','#DBZ'];
  
  tweetList: Tweet[] = [];

  timeToGenerate: number = 100;
  timerGenerate: number = this.timeToGenerate;

  // OLD STUFF

  favoriteSeason: string = 'Only One Match';
  seasons: string[] = ['Only One Match', 'Multiple Match'];

  master_checked: boolean = false;
  master_indeterminate: boolean = true;

  _match_complete: boolean = false;
  _match_in_process: boolean = false;
  _input: string = '';
  _token: string = '';
  
  _formatPattern: boolean = false;
  _regexActivate: boolean = false;
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

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    for(let i=0; i < 4; i++){
      this.generateTweet();
    }
  }

  generateTweet(){
    this.timerGenerate = this.timeToGenerate;
    let text = this.textExamples[this.getRandomInt(this.textExamples.length)];
    this.tweetList.unshift({
      username: 'PLeger',
      content: text.substring(0, text.length),
      hashtag: [this.hashtagExample[this.getRandomInt(this.hashtagExample.length)]],
      match: false,
      total: 0
    });
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
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
        pattern: this.generateNoRegexPattern(this.newSequence.toLowerCase().split(" ").join("")),
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
      const solution = new Solution([...cellList],this._evolutionRule, this._postEvolutionRule);
      solution.match(tweet.content.toLowerCase().split(" ").join(""));
      const total_matches = SingletonOffline.getInstance().Matches().length;
      tweet.match = total_matches != 0;
      tweet.total = total_matches;
    }

    this._match_in_process = false;
    this._match_complete = true;
    this.spinner.hide();
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

}
