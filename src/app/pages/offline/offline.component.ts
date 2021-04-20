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


import {MatDialog} from '@angular/material/dialog';
import { GenerateInputComponent } from '../../dialogs/generate-input/generate-input.component';



interface MatchView{
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

  _tokenArr: string[] = [];
  _tokenPattern: Pattern = null;
  _evolutionRule: Evolution = null;
  _postEvolutionRule: Rule = null;

  checkbox_list = [
    {
      name: "Identity",
      disabled: true,
      checked: true,
      labelPosition: "after",
      rule: new Identity()
    }, {
      name: "Add Seed",
      disabled: false,
      checked: false,
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
    this._tokenArr = [...this._token];

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

  generateEvolutionRule(){
    if(this.favoriteSeason === 'Only One Match'){
      this._evolutionRule = new OnlyOneMatch();
    }else{
      this._evolutionRule = new MultipleMatch();
    }
  }

  generatePostEvolutionRute(){
    // si addseed esta checkeado
    if(this.checkbox_list[1].checked){
      this._postEvolutionRule = new AddSeed();
    }else{
      this._postEvolutionRule = new Identity();
    }
  }

  matchProcess(){
    this._match_complete = false;
    
    SingletonOffline.getInstance().Reset();

    this.generateInitialPattern();

    this.generateEvolutionRule();
    
    this.generatePostEvolutionRute();

    const solution = new Solution([new Cell(this._tokenPattern, new MetaInformation(0))],this._evolutionRule, this._postEvolutionRule);

    solution.match(this._input);

    this.getInformationInputMatch();

    this._match_complete = true;
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

}
