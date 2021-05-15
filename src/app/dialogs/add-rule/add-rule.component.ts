import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-rule',
  templateUrl: './add-rule.component.html',
  styleUrls: ['./add-rule.component.css']
})
export class AddRuleComponent implements OnInit {
  _nameRule: string = 'NewRule';
  _functionRule: string = `(cells, pattern) => {
      let status = cells.length === 0;
      return status ? [Cell(pattern, null)] : cells;\n}`;


  rules_examples: any[] = [
    {
      name: '1. Basic',
      example: `(cells, pattern) => {
        let status = cells.length === 0;
        return status ? [Cell(pattern, null)] : cells;\n}`
    },
    {
      name: '2. Symbol',
      example: `(cells, pattern) => {
        let status = cells.length === 0;
        let newPattern = Symbol('a');
        return status ? [Cell(newPattern, null)] : cells;\n}`
    },
    {
      name: '3. Sequence',
      example: `(cells, pattern) => {
        let status = cells.length === 0;
        let newPattern = Sequence(Symbol('a'),Symbol('b'));
        return status ? [Cell(newPattern, null)] : cells;\n}`
    },
    {
      name: '4. Star',
      example: `(cells, pattern) => {
        let status = cells.length === 0;
        let newPattern = Star(Symbol('a'));
        return status ? [Cell(newPattern, null)] : cells;\n}`
    },
    {
      name: '5. Plus',
      example: `(cells, pattern) => {
        let status = cells.length === 0;
        let newPattern = Plus(Symbol('a'));
        return status ? [Cell(newPattern, null)] : cells;\n}`
    }
  ]

  constructor(
    public dialogRef: MatDialogRef<AddRuleComponent>
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
