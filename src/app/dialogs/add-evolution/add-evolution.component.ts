import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-evolution',
  templateUrl: './add-evolution.component.html',
  styleUrls: ['./add-evolution.component.css']
})
export class AddEvolutionComponent implements OnInit {
  _nameRule: string = 'NewRule';
  _functionRule: string = `(cells, token, idx) => {
    return cells[0].react(token, idx);\n}`;

  rules_examples: any[] = [
    {
      name: '1. OOM',
      example: `(cells, token, idx) => {
        return cells[0].react(token, idx);\n}`
    },
    {
      name: '2. MM',
      example: `(cells, token, idx) => {
        let cellsEvolution = [...cells];
        for(let j=0; j < cellsEvolution.length; j++){
          let cellIteration = cellsEvolution[j].react(token,idx)[0];
          if(cellIteration !== undefined && cellIteration != cellsEvolution[j]){
              cellIteration.metaInformation = MetaInformation(idx, cells[j]);
              cells.push(cellIteration);
          }
        }
        return cells;\n}`
    }
  ]

  constructor(
    public dialogRef: MatDialogRef<AddEvolutionComponent>
  ) { }

  ngOnInit(): void {
  }

  confirmDialog(){
    this.dialogRef.close(
      {
        name: this._nameRule,
        js: this._functionRule
      }
    );
  }

  onChange(event: string) {
    this._functionRule = event;
  }
}
